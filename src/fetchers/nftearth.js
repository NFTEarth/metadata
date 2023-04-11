import axios from "axios";
import { Contract } from "ethers";
import { Interface } from "ethers/lib/utils";
import slugify from "slugify";

import { parse } from "../parsers/nftearth";
import { getProvider } from "../shared/utils";
import { logger } from "../shared/logger";
import _ from "lodash";

const parseUri = (uri) => {
  const error = /Error: /.test(uri);

  return error ? null : uri || null
}

const fetchContract = async (chainId, contract) => {
  const nftContract = new Contract(contract, new Interface([
    "function name() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function tokenURI(uint256 _tokenId) external view returns (string)",
    "function uri(uint256 _tokenId) external view returns (string)",
  ]), getProvider(chainId));

  const contractName = await nftContract.name().catch(() => null);
  const totalSupply = await nftContract.functions.totalSupply().catch(() => null);
  let erc721Metadata = await nftContract.functions.tokenURI(0).then(res => parseUri(res?.[0])).catch(() => null);
  let erc1155Metadata = await nftContract.functions.uri(0).then(res => parseUri(res?.[0])).catch(() => null);
  if (erc721Metadata === null && erc1155Metadata === null) {
    erc721Metadata = await nftContract.functions.tokenURI(1).then(res => parseUri(res?.[0])).catch(() => null);
    erc1155Metadata = await nftContract.functions.uri(1).then(res => parseUri(res?.[0])).catch(() => null);
  }
  const metadataUri = (erc721Metadata || erc1155Metadata || '').replace(/^ipfs?:\/\//, 'https://ipfs.io/ipfs/');

  const { data } = await axios.get(metadataUri);

  return {
    id: contract,
    collection: _.toLower(contract),
    name: contractName || data.name,
    description: data.description,
    totalSupply: totalSupply,
    imageUrl: (data.image || '').replace(/^ipfs?:\/\//, 'https://ipfs.io/ipfs/'),
    externalUrl: data?.external_url,
    kind: erc721Metadata ? 'ERC721' : 'ERC1155'
  };
}

const fetchToken = async (chainId, contract, tokenId) => {
  const nftContract = new Contract(contract, new Interface([
    "function name() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function tokenURI(uint256 _tokenId) external view returns (string)",
    "function uri(uint256 _tokenId) external view returns (string)",
  ]), getProvider(chainId));

  const contractName = await nftContract.name().catch(() => null);
  const erc721Metadata = await nftContract.functions.tokenURI(tokenId).then(res => parseUri(res?.[0])).catch(() => null);
  const erc1155Metadata = await nftContract.functions.uri(tokenId).then(res => parseUri(res?.[0])).catch(() => null);
  const metadataUri = (erc721Metadata || erc1155Metadata || '').replace(/^ipfs?:\/\//, 'https://ipfs.io/ipfs/');
  const { data } = await axios.get(metadataUri);

  return {
    id: tokenId,
    contract: {
      address: contract,
      name: contractName,
    },
    metadata: data
  };
}

export const fetchCollection = async (chainId, { contract }) => {
  try {
    let data = await fetchToken(chainId, contract, 0).catch(() => null);
    if (data === null) {
      data = await fetchToken(chainId, contract, 1).catch(() => {});
    }

    const slug = slugify(data.contract.name, { lower: true });
    const metadata = parse(data) || {};

    return {
      id: contract,
      slug,
      name: data.contract.name,
      community: null,
      metadata: {
        description: metadata.description || null,
        imageUrl: metadata.imageUrl || null,
        bannerImageUrl: null,
        discordUrl: metadata.discordUrl || null,
        externalUrl: metadata.externalUrl || null,
        twitterUsername: metadata.twitterUsername || null,
      },
      contract,
      tokenIdRange: null,
      tokenSetId: `contract:${contract}`,
    };
  } catch(e) {
    logger.error('nftearth-fetcher', e.message)

    try {
      const name = await new Contract(
        contract,
        new Interface(["function name() view returns (string)"]),
        getProvider(chainId)
      ).name();

      return {
        id: contract,
        slug: slugify(name, { lower: true }),
        name: name,
        community: null,
        metadata: null,
        contract,
        tokenIdRange: null,
        tokenSetId: `contract:${contract}`,
        isFallback: true,
      };
    } catch (e) {
      logger.error('nftearth-fetcher', e.message)
      return null;
    }
  }
};

export const fetchTokens = async (chainId, tokens) => {
  const data = await Promise.all(
    tokens.map(({ contract, tokenId }) => fetchToken(chainId, contract, tokenId))
  )
    .catch((error) => {
      logger.error(
        "nftearth-fetcher",
        `fetchTokens error. chainId:${chainId}, message:${error.message},  status:${
          error.response?.status
        }, data:${JSON.stringify(error.response?.data)}`
      );

      throw error;
    });

  return data.map(parse).filter(Boolean);
};

const limit = 10;
export const fetchContractTokens = async (chainId, contract, continuation) => {
  const currentId = parseInt(continuation) || 0;
  const contractData = await fetchContract(chainId, contract);
  const data = await fetchTokens(chainId, _.range(continuation, continuation + limit).map(tokenId => ({ contract, tokenId})));

  return {
    continuation: currentId < contractData.totalSupply ? continuation + limit : undefined,
    metadata: data.map(parse).filter(Boolean),
  };
};
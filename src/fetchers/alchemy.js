import axios from "axios";
import { Contract } from "ethers";
import { Interface } from "ethers/lib/utils";
import slugify from "slugify";

import { parse } from "../parsers/alchemy";
import { getProvider } from "../utils";
import { logger } from "../logger";

const getNetworkName = (chainId) => {
  let network;
  if (chainId === 1) {
    network = "eth-mainnet";
  } else if (chainId === 10) {
    network = "opt-mainnet";
  } else if (chainId === 137) {
    network = "polygon";
  } else if (chainId === 42161) {
    network = "arb-mainnet";
  } else {
    throw new Error("Unsupported chain id");
  }

  return network;
};

export const fetchCollection = async (chainId, { contract }) => {
  try {
    const network = getNetworkName(chainId);

    const url = `https://${network}.g.alchemy.com/nft/v2/${process.env.ALCHEMY_API_KEY}/getContractMetadata?contractAddress=${contract}`;
    const data = await axios
      .get(url, )
      .then((response) => response.data);

    const slug = slugify(data.name, { lower: true });
    const metadata = data.opensea || {};

    return {
      id: contract,
      slug,
      name: data.name,
      community: null,
      metadata: {
        description: metadata.description || null,
        imageUrl: metadata.imageUrl || null,
        bannerImageUrl: null,
        discordUrl: metadata.discordUrl || null,
        externalUrl: metadata.externalUrl || null,
        twitterUsername: data.twitterUsername || null,
      },
      contract,
      tokenIdRange: null,
      tokenSetId: `contract:${contract}`,
    };
  } catch {
    try {
      logger.error(
        "alchemy-fetcher",
        `fetchCollection error. chainId:${chainId}, contract:${contract}, message:${
          error.message
        },  status:${error.response?.status}, data:${JSON.stringify(
          error.response?.data
        )}`
      );

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
    } catch {
      return null;
    }
  }
};

export const fetchTokens = async (chainId, tokens) => {
  const network = getNetworkName(chainId);

  const searchParams = new URLSearchParams();
  const nftIds = tokens.map(
    ({ contract, tokenId }) => `${network}.${contract}.${tokenId}`
  );
  searchParams.append("nft_ids", nftIds.join(","));

  const url = `https://${network}.g.alchemy.com/nft/v2/${process.env.ALCHEMY_API_KEY}/getNFTMetadataBatch`;
  const data = await axios
    .post(url, {
      tokens: tokens.map(({ contract, tokenId, tokenKind }) => (
        {
          contractAddress: contract,
          tokenId,
          tokenType: tokenKind
        }
      ))
    })
    .then((response) => response.data)
    .catch((error) => {
      logger.error(
        "alchemy-fetcher",
        `fetchTokens error. chainId:${chainId}, message:${
          error.message
        },  status:${error.response?.status}, data:${JSON.stringify(
          error.response?.data
        )}`
      );

      throw error;
    });

  return data.map(parse).filter(Boolean);
};

export const fetchContractTokens = async (chainId, contract, continuation) => {
  const network = getNetworkName(chainId);

  const searchParams = new URLSearchParams();
  searchParams.append('contractAddress', contract);
  searchParams.append('withMetadata', true);
  if (continuation) {
    searchParams.append("startToken", continuation);
  }

  const url = `https://${network}.g.alchemy.com/nft/v2/${process.env.ALCHEMY_API_KEY}/getNFTsForCollection?${searchParams.toString()}`;
  const data = await axios
    .get(url)
    .then((response) => response.data);

  return {
    continuation: data.nextToken,
    metadata: data.nfts.map(parse).filter(Boolean),
  };
};
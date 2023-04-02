import axios from "axios";
import * as opensea from "../../fetchers/opensea";
import {getCollectionTokenIdRange} from "../async-blueprints";

export const fetchCollection = async (_chainId, { contract, tokenId }) => {
  return {
    id: `${contract}`,
    slug: "zkhippoevm",
    name: `zkHippoEVM`,
    metadata: {
      imageUrl: 'https://omnisea.infura-ipfs.io/ipfs/QmTrioUf6cHsrNhJjd4spu6kohv8ejJVp5ij7iRNpLFdf7',
      description: 'zkHippoEVM is just Collection.\\nNo utility, no roadmap, only artwork.\\nDYOR and Trade at your own risk.',
      externalUrl: null,
    },
    contract,
    tokenIdRange: null,
    tokenSetId: null,
  };
};

export const fetchToken = async (chainId, { contract, tokenId }) => {
  const metadata = await axios
    .get(`https://cf-ipfs.com/ipfs/QmQvc4FujGqmE5jE7CHCCNovzv1PPfYEsqB8VDFBdMNhfn/${tokenId}.json`)
    .then((response) => response.data);

  const attributesMap = {};
  const attributes = metadata.attributes.map((a) => {
    attributesMap[a.trait_type] = a.value;
    return {
      key: a.trait_type,
      value: a.value,
      kind: "string",
      rank: 1,
    };
  });

  return {
    contract,
    tokenId,
    collection: contract.toLowerCase(),
    name: metadata.name,
    imageUrl: metadata.image,
    mediaUrl: null,
    flagged: false,
    attributes,
  };
};

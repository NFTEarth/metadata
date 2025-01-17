import axios from "axios";

export const fetchCollection = async (_chainId, { contract, tokenId }) => {
  return {
    id: contract.toLowerCase(),
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

  return {
    contract,
    tokenId,
    collection: contract.toLowerCase(),
    name: metadata.name,
    imageUrl: metadata.image,
    mediaUrl: null,
    flagged: false,
    attributes: [],
  };
};

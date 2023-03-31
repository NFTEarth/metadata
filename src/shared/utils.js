import { providers } from "ethers";

export const getNetworkName = (chainId) => {
  let network;
  if (chainId === 1) {
    network = "eth-mainnet";
  } else if (chainId === 10) {
    network = "opt-mainnet";
  } else if (chainId === 137) {
    network = "polygon-mainnet";
  } else if (chainId === 1101) {
    network = "polygonzkevm-mainnet";
  } else if (chainId === 42161) {
    network = "arb-mainnet";
  } else {
    throw new Error("Unsupported chain id");
  }

  return network;
};


export const getAPIKey = (chainId) => {
  let apiKey;
  if (chainId === 1) {
    apiKey = process.env.ALCHEMY_API_KEY;
  } else if (chainId === 10) {
    apiKey = process.env.OPT_ALCHEMY_API_KEY;
  } else if (chainId === 137) {
    apiKey = process.env.MATIC_ALCHEMY_API_KEY;
  } else if (chainId === 1101) {
    apiKey = process.env.ZKEVM_ALCHEMY_API_KEY;
  } else if (chainId === 42161) {
    apiKey = process.env.ARB_ALCHEMY_API_KEY;
  } else {
    throw new Error("Unsupported chain id");
  }

  return apiKey;
};

export const getProvider = (chainId) => {
  return new providers.AlchemyProvider(chainId, getAPIKey(chainId));
};

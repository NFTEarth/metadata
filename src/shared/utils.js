import { UrlJsonRpcProvider } from "@ethersproject/providers/lib/url-json-rpc-provider";
import { showThrottleMessage } from "@ethersproject/providers/lib/formatter";
import { AlchemyWebSocketProvider } from "@ethersproject/providers/lib/alchemy-provider";
import { Logger } from "@ethersproject/logger";
import { version } from "@ethersproject/providers/lib/_version";
const logger = new Logger(version);

const defaultApiKey = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC"

class AlchemyProvider extends UrlJsonRpcProvider {
  static getWebSocketProvider(network, apiKey) {
    return new AlchemyWebSocketProvider(network, apiKey);
  }

  static getApiKey(apiKey) {
    if (apiKey == null) { return defaultApiKey; }
    if (apiKey && typeof(apiKey) !== "string") {
      logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
    }
    return apiKey;
  }

  static getUrl(network, apiKey) {
    let host = null;
    switch (network.name) {
      case "homestead":
        host = "eth-mainnet.alchemyapi.io/v2/";
        break;
      case "goerli":
        host = "eth-goerli.g.alchemy.com/v2/";
        break;
      case "zkevm":
        host = "polygonzkevm-mainnet.g.alchemy.com/v2/";
        break;
      case "matic":
        host = "polygon-mainnet.g.alchemy.com/v2/";
        break;
      case "maticmum":
        host = "polygon-mumbai.g.alchemy.com/v2/";
        break;
      case "arbitrum":
        host = "arb-mainnet.g.alchemy.com/v2/";
        break;
      case "arbitrum-goerli":
        host = "arb-goerli.g.alchemy.com/v2/";
        break;
      case "optimism":
        host = "opt-mainnet.g.alchemy.com/v2/";
        break;
      case "optimism-goerli":
        host = "opt-goerli.g.alchemy.com/v2/"
        break;
      default:
        logger.throwArgumentError("unsupported network", "network", arguments[0]);
    }

    return {
      allowGzip: true,
      url: ("https:/" + "/" + host + apiKey),
      throttleCallback: (attempt, url) => {
        if (apiKey === defaultApiKey) {
          showThrottleMessage();
        }
        return Promise.resolve(true);
      }
    };
  }

  isCommunityResource() {
    return (this.apiKey === defaultApiKey);
  }
}

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

export const getEthNetworkName = (chainId) => {
  let network;
  if (chainId === 1) {
    network = "homestead";
  } else if (chainId === 10) {
    network = "optimism";
  } else if (chainId === 137) {
    network = "polygon";
  } else if (chainId === 1101) {
    network = "zkevm";
  } else if (chainId === 42161) {
    network = "arbitrum";
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
  return new AlchemyProvider({
    chainId: chainId,
    name: getEthNetworkName(chainId),
  }, getAPIKey(chainId));
};

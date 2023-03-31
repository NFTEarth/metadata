import _ from "lodash";

import { customHandleCollection, hasCustomCollectionHandler } from "../../../../../src/custom";
import { extendCollectionMetadata } from "../../../../../src/extend";

import * as opensea from "../../../../../src/fetchers/opensea";
import * as rarible from "../../../../../src/fetchers/rarible";
import * as simplehash from "../../../../../src/fetchers/simplehash";
import * as alchemy from "../../../../../src/fetchers/alchemy";
import * as centerdev from "../../../../../src/fetchers/centerdev";
import * as soundxyz from "../../../../../src/fetchers/soundxyz";
import * as nftearth from "../../../../../src/fetchers/nftearth";

const api = async (req, res) => {
  try {
    // Validate network and detect chain id
    const network = req.query.network;
    if (!["mainnet", "rinkeby", "goerli", "optimism", "arbitrum", "polygon", "zkevm"].includes(network)) {
      throw new Error(`Unknown network : ${req.query.network}`);
    }

    let chainId = 1;
    switch (network) {
      case "mainnet":
        chainId = 1;
        break;
      case "rinkeby":
        chainId = 4;
        break;
      case "goerli":
        chainId = 5;
        break;
      case "optimism":
        chainId = 10;
        break;
      case "polygon":
        chainId = 137;
        break;
      case "zkevm":
        chainId = 1101;
        break;
      case "arbitrum":
        chainId = 42161;
        break;
    }

    // Validate indexing method and set up provider
    const method = req.query.method;
    if (
      !["opensea", "rarible", "alchemy", "nftearth", "simplehash", "centerdev", "soundxyz"].includes(method)
    ) {
      throw new Error("Unknown method");
    }

    let provider = opensea;
    if (method === "rarible") {
      provider = rarible;
    } else if (method === "alchemy") {
      provider = alchemy;
    } else if (method === "nftearth") {
      provider = nftearth;
    } else if (method === "simplehash") {
      provider = simplehash;
    } else if (method === "centerdev") {
      provider = centerdev;
    } else if (method === "soundxyz") {
      provider = soundxyz;
    }

    const token = req.query.token?.toLowerCase();
    if (!token) {
      throw new Error("Missing token");
    }

    const [contract, tokenId] = token.split(":");
    if (!contract) {
      throw new Error(`Unknown contract ${contract}`);
    }

    if (!tokenId) {
      throw new Error(`Unknown tokenId ${tokenId}`);
    }

    let collection = null;
    if (hasCustomCollectionHandler(chainId, contract)) {
      collection = await customHandleCollection(chainId, { contract, tokenId });
    } else {
      collection = await provider.fetchCollection(chainId, {
        contract,
        tokenId,
      });
    }

    if (!collection || _.isEmpty(collection)) {
      throw new Error("No collection found");
    }

    return res.status(200).json({
      collection: await extendCollectionMetadata(chainId, collection, tokenId),
    });
  } catch (error) {
    return res.status(500).json({ error: `Internal error: ${error}` });
  }
};

export default api;

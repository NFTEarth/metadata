import _ from "lodash";

export const parse = (asset) => {
  return {
    contract: asset.contract.address,
    tokenId: asset.id.tokenId,
    name: asset.title,
    collection: _.toLower(asset.contract.address),
    // Token descriptions are a waste of space for most collections we deal with
    // so by default we ignore them (this behaviour can be overridden if needed).
    description: asset.description,
    imageUrl: asset.media?.[0]?.thumbnail || asset.metadata?.image,
    mediaUrl: asset.metadata?.animation_url || asset.media?.[1]?.gateway,
    attributes: (asset.metadata?.attributes || []).map((trait) => ({
      key: trait.trait_type,
      value: trait.value,
      kind: typeof trait.value == "number" ? "number" : "string",
      rank: 1,
    })),
  };
};

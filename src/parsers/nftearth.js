import _ from "lodash";

export const parse = (asset) => {
  return {
    contract: asset.contract.address,
    tokenId: asset.id,
    name: asset.metadata?.name || `${asset.contract.name} #${asset.id}`,
    collection: _.toLower(asset.contract.address),
    // Token descriptions are a waste of space for most collections we deal with
    // so by default we ignore them (this behaviour can be overridden if needed).
    description: asset.metadata?.description,
    imageUrl: (asset.metadata?.image || '').replace(/^ipfs?:\/\//, 'https://cloudflare-ipfs.com/ipfs/'),
    mediaUrl: (asset.metadata?.animation_url || '').replace(/^ipfs?:\/\//, 'https://cloudflare-ipfs.com/ipfs/'),
    externalUrl: asset.metadata?.external_url,
    attributes: (asset.metadata?.attributes || []).map((trait) => ({
      key: trait.trait_type,
      value: trait.value,
      kind: typeof trait.value == "number" ? "number" : "string",
      rank: 1,
    })),
  };
};

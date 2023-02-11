export const extend = async (_chainId, metadata) => {
  try {
    metadata.attributes = (metadata.attributes || []).map((trait) => ({
      key: trait.trait_type,
      value: trait.value,
      kind: trait.trait_type === "birthday" ? "range" : trait.trait_type
    }));

    return { ...metadata };
  } catch (error) {
    throw error
  }
};

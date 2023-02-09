export const extend = async (_chainId, metadata) => {
  try {
    metadata.attributes = (metadata.attributes || []).map((trait) => ({
      key: trait.trait_type,
      value: trait.value,
      kind: trait.trait_type === "Birthday" ? "range" : "string"
    }));

    return { ...metadata };
  } catch (error) {
    throw error
  }
};

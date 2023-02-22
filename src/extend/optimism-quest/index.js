export const extend = async (_chainId, metadata) => {
  try {
    metadata.attributes = (metadata.attributes || []).map((trait) => ({
      key: trait.key,
      value: trait.value,
      kind: trait.key === "birthday" ? "range" : trait.kind,
    }));

    return { ...metadata };
  } catch (error) {
    throw error;
  }
};

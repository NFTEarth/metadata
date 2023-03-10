export const extend = async (_chainId, metadata) => {
  try {
    return { ...metadata };
  } catch (error) {
    throw error;
  }
};

export const extend = async (_chainId, metadata) => {
  const Clothes = metadata.attributes.find(t => /Clothes/i.test(t.trait_type));
  if (/None/i.test(Clothes.value)) {
    return null;
  }

  return metadata;
}
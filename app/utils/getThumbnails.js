export default (images) => {
  return images
    .filter((img) => !img.src.includes('data:') || img.src.includes(process.env.DOMAIN))
    .map((img) => img.src)
}

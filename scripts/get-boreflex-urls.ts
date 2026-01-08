import { db } from "@/db"

async function getBoreFlexImageUrls() {
  const allProducts = await db.query.products.findMany({
    with: {
      images: true,
      category: true,
    },
  })

  const boreFlexProducts = allProducts.filter(
    (p) => p.category?.slug === "rubber-expansion-joints"
  )

  console.log("Bore-Flex Product Images:\n")

  const imageUrls: string[] = []

  boreFlexProducts.forEach((p) => {
    const primaryImage = p.images.find((img) => img.isPrimary && img.type === "image")
    if (primaryImage) {
      console.log(`${p.name}:`)
      console.log(`  ${primaryImage.url}`)
      imageUrls.push(primaryImage.url)
    }
  })

  console.log(`\n\nTotal images: ${imageUrls.length}`)
  console.log(`\nCopy-paste command:\n`)
  console.log(`python scripts/remove-backgrounds.py --urls "${imageUrls.join(",")}" --process`)
}

getBoreFlexImageUrls()
  .then(() => process.exit(0))
  .catch(console.error)

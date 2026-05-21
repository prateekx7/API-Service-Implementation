const TOTAL_PRODUCTS = 1000;

async function seed() {
  for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
    await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Product ${i}`,
        sku: `SKU-${i}`,
        image_urls: Array.from(
          { length: 10 },
          (_, idx) =>
            `https://cdn.example.com/products/${i}/image-${idx}.jpg`
        ),
        video_urls: [
          `https://cdn.example.com/products/${i}/demo.mp4`,
        ],
      }),
    });
  }

  console.log("Seeding completed");
}

seed();
const fs = require('fs').promises;

async function mergeData() {
  try {
    const [productData, pricingData, categoryData] = await Promise.all([
      fs.readFile('./data/product.json', 'utf8'),
      fs.readFile('./data/pricing.json', 'utf8'),
      fs.readFile('./data/category.json', 'utf8'),
    ]);

    const pricingMap = new Map();
    JSON.parse(pricingData).forEach((item) => {
      pricingMap.set(item.sku, item.price);
    });

    const productDataArray = JSON.parse(productData);

    const mergedData = productDataArray.map((product) => ({
      id: product.id,
      sku: product.sku,
      productName: product.productName,
      category: product.category,
      price: pricingMap.get(product.sku) || 0,
    }));

    await fs.writeFile('./result.json', JSON.stringify(mergedData, null, 2));
    console.log('Data merged and saved to result.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

mergeData();

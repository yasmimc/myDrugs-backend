import createCategories from "../tests/factories/createCategories.js";
import createProducts from "../tests/factories/createProducts.js";

console.log("creating categories...")
const categories = await createCategories(3)
console.log("creating producst...")
createProducts([ ...categories.map(cat => cat.id), ...categories.map(cat => cat.id) ])
console.log("Done !")



export default function createCheckoutBody(user, products) {
    return {
        userId: user.id,
        name: user.name,
        email: user.email,
        cep: "58900000",
        addressNumber: parseInt(Math.random()*1000),
        products: products.map(product => ({
            productId: product.id,
            ammount: 1,
        }))
    }
}
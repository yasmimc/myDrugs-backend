
export default function createCheckoutBody(user, paymentId, cartId) {
    return {
        userId: user.id,
        paymentId: paymentId,
        cartId: cartId,
        name: user.name,
        email: user.email,
        cep: "58900000",
        addressNumber: parseInt(Math.random()*1000)
    }
}
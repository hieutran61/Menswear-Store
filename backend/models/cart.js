import mongoose from 'mongoose';

const cartItem = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    quantity: { type: Number, required: true },
    itemPrice: { type: Number, required: true },
    size: {type: String, required: true}
});

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        cartItems: [cartItem],
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        }
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

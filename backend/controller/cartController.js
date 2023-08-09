const Cart = require('../models/cartModel');
const utils = require('../utils/response');

exports.pushCartProductsFromLocalStorageToCart = async (req, res) => {
    const userId = req.user._id;

    console.log("Local", req.body);
    const localStorageItems = req.body.cartItems;
    console.log(localStorageItems);
    const cart = await Cart.findOne({userId: userId});

    if(!cart) {
        const cart = new Cart({
            userId: userId,
            cartItems: localStorageItems,
        });
        await cart.save();
    } else {
        cart.cartItems = localStorageItems;
        await cart.save();
    }
    
    utils.response(res, 'success', "LocalStorage Items are added to Cart db Successfully", cart, 200);
}

exports.pushCartProductsFromCartToLocalStorage = async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({userId: userId});
    console.log("cart s", cart);
    let cartItems = [];
    if(cart) {
        cartItems = cart.cartItems;
    }

    utils.response(res, 'success', "Cart Items Sent Successfully", cartItems, 200);
}
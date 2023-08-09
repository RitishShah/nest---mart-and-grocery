const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },

    cartItems: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                // required: true
            },

            name: {
                type: String,
                // required: true,
            },

            quantity: {
                type: Number,
                // required: true,
            },

            price: {
                type: Number,
                // required: true,
            },

            totalPrice: {
                type: Number,
                // required: true,
            },

            stock: {
                type: Number
            },
            
            category: {
                type: String
            },
            
            images: [
                {
                    public_id: {
                        type:String,
                        // required:true
                    },
                    url: {
                        type:String,
                        // require:true
                    }
                }
            ],
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);
const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },

    favouriteItems: [
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

            price: {
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

module.exports = mongoose.model("Favourite", favouriteSchema);
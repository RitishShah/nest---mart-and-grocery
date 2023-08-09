const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
    },
    description: {
        type:String,
    },
    price: {
        type:Number,
    },
    offerPrice: {
        type:String,
    },
    color: {
        type:String
    },
    size: {
        type:String
    },
    rating: {
        type:Number,
        default:0
    },
    images: [
        {
            public_id: {
                type:String,
                required:true
            },
            url: {
                type:String,
                require:true
            }
        }
    ],
    category: {
        type:String,
    },
    stock: {
        type:Number,
    },
    numOfReviews: {
        type:Number,
        default:0
    },
    reviews:[
        {
            user: {
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name: {
                type:String,
                required:true
            },
            rating: {
                type:Number,
                required:true
            },
            comment: {
                type:String
            },
            time: {
                type:Date,
                default:Date.now()
            }
        }
    ],
    user: {
        type:mongoose.Schema.ObjectId,
        ref:'Users',
        // required:true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Product', productSchema);
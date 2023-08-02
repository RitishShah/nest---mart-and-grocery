const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Please enter a name for product"],
        trim:true,
        maxlength:[20, "Product name can't exceeds 20 chars"]
    },
    description: {
        type:String,
        required:[true, "Please add a description for your product"],
        maxlength:[4000, "Description can't exceeds 4000 characters"],
    },
    price: {
        type:Number,
        required:[true, "Please add a price for your product"],
        maxlength:[8, "Price can't exceeds 8 characters"]
    },
    discountPrice: {
        type:String,
        maxlength:[4, "Discount Price can't exceeds 4 characters"]
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
        required:[true, "Please add a category for your product"]
    },
    stock: {
        type:Number,
        required:[true, "Please add a stock for your product"],
        maxlength:[3, "Stock can't exceeds 3 characters"]
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
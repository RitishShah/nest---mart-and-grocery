const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    // pincode: {
    //   type: Number,
    //   required: true,
    // },
    phone: {
      type: Number,
      required: true,
    },
  },
  orderItems: [
    {
      category: {
        type: String,
        required: true
      },
      images: [
        {
          public_id: {
            type: String,
            required: true
          },
          url: {
            type: String,
            required: true
          },
          _id: {
            type: String,
            required: true
          }
        }
      ],
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true
      },
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      }
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    // type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("Order", orderSchema);
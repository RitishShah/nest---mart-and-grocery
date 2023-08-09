const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        // select: false,
    },
    avatar: {
        public_id: {
        type: String,
        // required: true,
        },
        url: {
        type: String,
        // required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});

userSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    if (!this.created_at) {
        this.created_at = Date.now();
    }
    next();
});


module.exports = mongoose.model('User', userSchema);
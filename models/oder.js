const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const productInCartSchema = new mongoose.Schema({
    product : {
        type : ObjectId,
        ref : "Product"
    },
    name: String,
    count: Number,
    price: Number
});

const productInCart = mongoose.model("ProductInCart",productInCartSchema);

const orderSchema = new mongoose.Schema({
    products : [productInCartSchema],
    transactionId :  {},
    amount : {type:Number},
    address : String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
},
{
    timestamps: true,
});

const order = mongoose.model("Order",orderSchema);

module.exports = {order, productInCart};
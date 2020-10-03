const mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var cartSchema = new mongoose.Schema({
    eggs: {
        type: Number,
        required: true,
    },
    non_veg1: {
        type: Number,
        required: true,
    },
    veg1: {
        type: Number,
        required: true,
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
     //TODO: Come back here
    encry_key:{
        type: String,
        required: true,
    },
    active:{
        type: Number,
        default:0
    },
    total:{
        type: Number,
        default:0,
        required:true
    },
    salt: String,

},{timestamps: true});

cartSchema.virtual("secret")
    .set(function(){
        this.total = 5*this.eggs+50*this.non_veg1+100*this.veg1;
        this._password = toString(this.email)+toString(this.total);
        this.salt = uuidv1();
        this.encry_key = this.securePassword(this._password);
        
    })
    .get(function(){
        return this._password;
    })

cartSchema.methods = {
    securePassword: function(plainPassword){
        if(!plainPassword){
            return "";
        }
        try{
            return crypto.createHmac('sha256',this.salt)
                .update(plainPassword)
                .digest('hex');
        }catch(err){
            return "";
        }
    }
}

module.exports = mongoose.model("Cart",cartSchema);
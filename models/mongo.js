const mongoose = require('mongoose');
//schema of users
const userschema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    detail : mongoose.Types.ObjectId,
    address : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    // cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    // wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' },
    
});



module.exports = mongoose.model("users",userschema);

//module.exports= {user,Address};
const User = require('./mongo')
const Address = require('./adressschema');
const Products= require('./products');
const Cart = require('./cart');
const Orders = require('./orders')
const Wishlist = require('./wishlist')


module.exports = {User,Address,Products,Cart,Orders,Wishlist};
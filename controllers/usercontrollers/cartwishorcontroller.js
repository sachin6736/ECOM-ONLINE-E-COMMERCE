const mongoose = require("mongoose");
const models = require('../../models/index');



const user = models.User;
const Address = models.Address;
const Products = models.Products.Product;
const categories = models.Products.Category;
const subcategories = models.Products.Subcategory;
const Cart = models.Cart;

exports.viewcar = async (req,res)=>{
  const id = req.session.userId;
  const products = await Products.find({});
  const category = await categories.find({});
  const cart = await Cart.findOne({user:id}).populate('items.productId');

  // console.log("cart",cart)
  res.render("user/cart", { products,category,cart,message: req.session.message })
}

exports.addcart = async (req, res) => {
  try {
    const userid = req.session.userId;
    const { productid } = req.body;
    console.log("proid", productid);
    const pr = await Products.findById(productid)
    if(!pr){
      return res.status(404).send("no product found");
    }
    if (!userid) {
      console.log("login first")
      req.session.errormessage = "you must login to continue" ;
      return res.status(401).send(" login first ")
    }
    let cart = await Cart.findOne({ user: userid });
    if (!cart) {
      cart = new Cart({ user: userid, items: [] });
    }
    // Check if the product already exists in the cart
    const existing = cart.items.find(item => item.productId.toString() === productid);
    if (existing) {
      console.log("Product already exists in the cart");
      res.status(200).json({ message: "Product already in cart", cart });
    } else {
      cart.items.push({
        productId: productid,
        quantity: 1
      });
      await cart.save();
      res.status(200).json({ message: "Product added to cart", cart });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
};

exports.deletecart = async(req,res)=>{
  try{
    const userid = req.session.userId;
    console.log("user",userid)
    const {itemId} = req.body;
    console.log("pro",itemId)
    const cart  =  await Cart.findOneAndUpdate(
      { user: userid },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );
    res.redirect('/cart')
    console.log("cart",cart);
  }catch(error){
    console.log(error)
  }
}//deleteing prroducts frrom cart

exports.updatrproduct=async (req, res) => {
  try {
    const { itemId, newQuantity } = req.body;
    const user = req.session.userId;

    if (!user) {
      return res.status(404).send("No user found");
    }

    const cart = await Cart.findOne({ user: user });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    const product = await Products.findOne({ _id: itemId });

    if (!product) {
      return res.status(404).send("No such product");
    }

    let stock = product.stock;

    if (newQuantity > stock) {
      return res.status(401).send("Stock exceeded");
    }

    const cartItem = cart.items.find(item => item.productId.toString() === itemId);

    if (!cartItem) {
      return res.status(404).send("Product not found in cart");
    }

    cartItem.quantity = newQuantity;
    await cart.save();

    res.status(200).send("Product quantity updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};//updating cart

exports.order = async (req,res)=>{
  const id = req.session.userId;
  const products = await Products.find({});
  const category = await categories.find({});
  const use = await user.findOne({ _id: id }).populate('address');

  console.log("usr",use)
  const cart = await Cart.findOne({user:id}).populate('items.productId');
  const isAddressConfirmed = use.address && use.address.length > 0;
  // console.log("cart",cart)
  res.render("user/order", { products,category,cart,use,isAddressConfirmed,message: req.session.message })
}
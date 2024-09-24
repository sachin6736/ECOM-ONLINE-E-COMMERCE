const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    offerprice: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category', // Reference to the Category collection
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcategory', // Reference to the Subcategory collection
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayimage: [{
      type: String,
      required: true,
    }],
    images: [{
        type: String,
        required: true,
      }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
  });
const Product = mongoose.model('product',productschema);


//category schema
const categoryschema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true, // Ensure category names are unique
    },
    description: {
      type: String,
      required: true,
    },
  });

const Category= mongoose.model('category',categoryschema);

//subcategoryschma
const subcategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true, // Ensure subcategory names are unique
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category', // Reference to the Category collection
      required: true,
    },
});

const Subcategory = mongoose.model("subcategory",subcategorySchema);

module.exports = {Product,Category,Subcategory};
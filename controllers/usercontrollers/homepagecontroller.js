const mongoose = require("mongoose");
const models = require('../../models/index');

const user = models.User;
const Address = models.Address;
const Products = models.Products.Product;
const categories = models.Products.Category;
const subcategories = models.Products.Subcategory;



//rendering pages/get request
exports.homepage= async (req,res)=>{
    const products =  await Products.aggregate([
        {
          $lookup: {
            from: 'categories', // The collection name for categories
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $lookup: {
            from: 'subcategories', // The collection name for subcategories
            localField: 'subcategory',
            foreignField: '_id',
            as: 'subcategory'
          }
        },
        {
          $unwind: '$subcategory'
        }
    ]);
    const category = await categories.aggregate([
      {
        $lookup: {
          from: 'subcategories', // The collection name for categories
          localField: '_id',
          foreignField: 'category',
          as: 'subcategory'
        }
      }
    ])
    // console.log("cate",category);
    // console.log(products)
    res.render("user/homepage", { products,category,message: req.session.message })
}
exports.adress = async (req,res)=>{
    const ObjectId = require('mongoose').Types.ObjectId;
    const id = new ObjectId(req.session.userId);
    const user1 = await user.aggregate([
    {$match : {_id:id}},
    {
        $lookup : {
            from : "addresses",
            localField : "address",
            foreignField : "_id",
            as : "address"
        }
    },
    //{$unwind : "$address"}
   ])
   console.log(user1);
   const errormessage = req.session.errormessage;
   req.session.errormessage = null;
   res.render("user/adress",{user1,errormessage});
}
//post requests
exports.adresschange = async (req, res) => {
    const { street, city, state, zip, landmark, mobile } = req.body;
    const userid = req.session.userId;
    try {
        // Find the user by ID
        const userToUpdate = await user.findById(userid);
        if (!userToUpdate) {
            return res.status(404).send('User not found.');
        }
        // Check if the user already has 3 or more addresses
        if (userToUpdate.address.length >= 3) {
            console.log('User already has 3 addresses.');
            req.session.errormessage = "sorry you cannot add more than 3 addresses";
            return res.redirect("/adress")
            //return res.status(400).send('Cannot add more than 3 addresses.');
        } else {
            // Since the user has less than 3 addresses, create a new address
            const ad = await Address.create({ street, city, state, zip, landmark, mobile });
            const adid = ad._id;
            console.log('adid', adid);            
            // Add the new address ID to the user's addresses array
            userToUpdate.address.push(adid);
            await userToUpdate.save();
            console.log('Address added:', req.body);
            res.redirect('/adress');
        }
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).send('Internal server error.');
    }
};
//productlistigpage controllers

exports.productlisting= async (req,res)=>{
  try{
    const id= req.params.id;
    console.log("id",id)
    const category = await categories.find();
    const products = await Products.find({subcategory:id});
    console.log("products", products);                                                      
    res.render('user/productlistingpage',{category,products,message: req.session.message})
  }catch(error){
    console.error("error",error)
  }
}



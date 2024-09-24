const models = require('../../models/index');
const fs = require('fs');
const path = require('path')

const user = models.User;
const Address = models.Address;
const Products = models.Products.Product;
const categories = models.Products.Category;
const subcategories = models.Products.Subcategory;
exports.adminhome=(req,res)=>{
    res.render("admin/adminhome");
}
// userdetail controllers
// =============================
//get requests
exports.users = async (req, res) => {
    const Users = await user.aggregate([
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "address"
            }
        },
    ]);
    
    console.log(Users);
    res.render("admin/users", {Users});
}

//deleterequests
exports.userdelete = async (req, res) => {
    try {
        await user.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user' });
    }
};
//categories and subcategory controllers//
//=============================
exports.cate = async (req, res) => {
    try {    // Fetch all categories with their respective product counts
      const category = await categories.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description:1,
            productCount: { $size: '$products' },
          },
        },
      ]);
      // Fetch all subcategories with their respective product counts
      const subcategory = await subcategories.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'subcategory',
            as: 'products',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            productCount: { $size: '$products' },
          },
        },
      ]);
  
      res.render('admin/categories', { category, subcategory });
    } catch (error) {
      console.error('Error fetching categories and subcategories:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  exports.deletecate = async (req, res)=>{
    try{
    const id = req.params.id;
    console.log('id',id);
    const catproduct = await Products.find({category:id});
    console.log('this is catproduct',catproduct);
    const images = catproduct.flatMap(eli =>eli.images);
    console.log("images is this",images)
    for(let image of images){
      const imagetodelete=  path.join(__dirname,'../../uploads',image);
        fs.unlinkSync(imagetodelete)
      }
    await Products.deleteMany({category:id});  
    await subcategories.deleteMany({category:id});
    await categories.findByIdAndDelete({
      _id:id});
    res.status(200).send('deleted')
    }catch(error){
      console.error('oops an error',error)
    }
  }

 // editcategory//
 //====================
exports.editcate = async (req,res)=>{
  try{
    const {name,description} = req.body;
    console.log('req body',req.body);
    const id = req.params.id;
    console.log('id',id)
    const cate = await categories.findById(id);
    console.log("cate",cate)
    if(!cate){
      res.send("no such category found")
    }else{
      await categories.updateOne({_id:id},{$set:{name:name,description:description}});
      res.status(200).send("changed");
    }
    }catch(error){
      console.error(error)
    }
  }

  // editsubcategory
  exports.editsubcate = async (req, res) => {
    try {
      const { name} = req.body;
      console.log('req body', req.body); 
      const id = req.params.id;
      console.log('id', id); 
      const subcate = await subcategories.findById(id);
      console.log("subcate", subcate); 
      if (!subcate) {
        res.status(404).send("No such subcategory found");
      } else {
        await subcategories.updateOne({ _id: id }, { $set: { name} });
        res.status(200).send("Subcategory updated successfully");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  };

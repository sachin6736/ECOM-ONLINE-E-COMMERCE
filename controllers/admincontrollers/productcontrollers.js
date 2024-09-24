const { log } = require('console');
const models = require('../../models/index');
const fs = require('fs');
const path = require('path')

const user = models.User;
const Address = models.Address;
const Products = models.Products.Product;
const categories = models.Products.Category;
const subcategories = models.Products.Subcategory;


//product controllers
//============================
// //get requests
exports.products = async (req, res) => {
  try {
    const sortOption = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const sortOptions = { 
      createdAt: { createdAt: sortOrder },          
      price: { price: sortOrder },
      offerprice: { offerprice: sortOrder },
      stock: { stock: sortOrder },
    };
    // Perform aggregation with sorting
    const products = await Products.aggregate([
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
      },
      {
        $sort: sortOptions[sortOption] || { createdAt: -1 } // Apply sorting based on query parameter
      }
    ]);

    // Render the page with the sorted products
    res.render('admin/productpage', { products, sortOption, sortOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


  //renderingproductpage the first page that is visible for the admin
exports.productadd = async (req,res)=>{
    const products = await Products.find();
    const cate= await categories.find();
    const subcat = await subcategories.find();
   res.render('admin/productform',{products,cate,subcat})
}//renderingproductformget.the secondpage after clicking add product
exports.getsubcat = async (req,res)=>{
    const categoryid = req.params.id;
    const subcategories= await models.Products.Subcategory.find({category : categoryid});
    res.json(subcategories);
}//getting subcategoriies

//postrequest
exports.addcat = async (req, res) => {
    const { name, description } = req.body;
    console.log(req.body);

    try {
        const existingCategory = await models.Products.Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive search
        });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category name already taken' });
        }else{
            await models.Products.Category.create({ name, description });
            res.send('Category added successfully');
        }  
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Internal server error');
    }
};//adding categories

//adding subcategories
exports.addsub = async (req,res)=>{
    const {name,category} = req.body;
    try{
      const images = req.files.map(file =>file.filename)
      const newcategory = new subcategories({
            name,
            category,
            images
      });
        await newcategory.save();
        res.redirect("/products/new")
    }catch(error){
      console.log(error)
      res.send("an error occured")
    }
    
    
}

exports.addproduct = async (req,res)=>{
    const {name,brand,price,offerprice,description,category,subcategory,stock} = req.body;
    try {
        const displayimage = req.files.displayimage.map(file => file.filename);
        const images = req.files.images.map(file =>file.filename)
        const newproduct = new Products({
            name,
            brand,
            price,
            offerprice,
            description,
            category,
            subcategory,
            stock,
            displayimage,
            images
        });
        await newproduct.save();
        res.redirect('/products/new');
    }catch(err){
        console.error(err);
        res.send('error occured')
    }
}// adding product

exports.deleteproduct = async (req,res)=>{
  try{
    const id = req.params.id;
    console.log(id);
    const product =  await Products.findById(id);
    console.log('this is product',product)
    if(!product){
      res.send("product not found");
    }else{
      const images = product.images;
      console.log("this are images",images)
      const displayimage = product.displayimage 
      console.log("this are dispayimages",displayimage)
      const allimagesset = new Set ([...displayimage,...images]);
      console.log("this are allimagesset ",allimagesset)
      const allimages = Array.from(allimagesset);
      console.log("this are allimages ",allimages)
      console.log(allimages);
      for(let image of allimages){
      const imagetodelete=  path.join(__dirname,'../../uploads',image);
        fs.unlinkSync(imagetodelete)
      }
      await Products.findByIdAndDelete(id);
      res.redirect('/products')
    }
  }catch(error){
    console.log("error",error)
  }
}//deleting products

exports.editproduct= async (req,res)=>{
  const id = req.params.id;
  const categ= await categories.find({})
  const sub = await subcategories.find({})
  const product = await Products.findById(id).populate("category").populate("subcategory");
  console.log(product)
  res.render('admin/editpro',{product,categ,sub})
}//rendering form for edit product

exports.editpro = async (req, res) => {
  const id = req.params.id;
  const { name, brand, price, offerprice, description, category, subcategory, stock } = req.body;
  try {
      // Log the form data for debugging
      console.log('Form data:', req.body);
      // Log the file data for debugging
      console.log('Files:', req.files);
      // Find the existing product
      const product = await Products.findById(id);
      if (!product) {
          return res.status(404).send('Product not found');
      }
      // Update product fields
      product.name = name;
      product.brand = brand;
      product.price = price;
      product.offerprice = offerprice;
      product.description = description;
      product.category = category;
      product.subcategory = subcategory;
      product.stock = stock;
      // Handle display image upload
      if (req.files.displayimage) {
          const oldImage = product.displayimage;
          console.log("Old display image:", oldImage);

          for (let image of oldImage) {
              const imageToDelete = path.join(__dirname, '../../uploads', image);
              try {
                  if (fs.existsSync(imageToDelete)) {
                      fs.unlinkSync(imageToDelete);
                  }
              } catch (err) {
                  console.error('Error deleting old display image:', err);
              }
          }
          product.displayimage = req.files.displayimage.map(file => file.filename);
      }
      // Handle product images upload
      if (req.files.images) {
          const oldImages = product.images;
          console.log("Old images:", oldImages);
          for (let image of oldImages) {
              const imageToDelete = path.join(__dirname, '../../uploads', image);
              try {
                  if (fs.existsSync(imageToDelete)) {
                      fs.unlinkSync(imageToDelete);
                  }
              } catch (err) {
                  console.error('Error deleting old images:', err);
              }
          }
          product.images = req.files.images.map(file => file.filename);
      }
      // Save the updated product
      await product.save();
      res.redirect("/products");
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Server Error');
  }
};
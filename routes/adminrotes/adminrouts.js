const express = require("express");
const homecontrol= require('../../controllers/admincontrollers/homecontrol');
const productcontrol = require('../../controllers/admincontrollers/productcontrollers');
const router = express.Router();
const upload = require ('../../middleware/multer')

//adminpage and userpage
//==================
//get requests
router.get("/adminhome",homecontrol.adminhome); //for the adminhomepage
router.get("/users",homecontrol.users);  //for showing the userepage to admin
//delete request
router.delete("/users/:id", homecontrol.userdelete);
//productpage
//===============
//getrequest
router.get('/products',productcontrol.products);  //for showing the productpage to admin
router.get("/products/new",productcontrol.productadd); //displaying form for adding products
router.get("/subcategories/:id",productcontrol.getsubcat);

//post requests//
router.post("/categories/add",productcontrol.addcat);//adding categories
router.post("/subcategories/add",upload.array('images', 10),productcontrol.addsub);//aading subcategories
//router.post("/products/add",upload.array('images', 10),productcontrol.addproduct);//adding products
router.post('/products/add', upload.fields([ { name: 'displayimage', maxCount: 1 },  { name: 'images', maxCount: 10 }]), productcontrol.addproduct);
router.post('/products/:id/edit',upload.fields([ { name: 'displayimage', maxCount: 1 },  { name: 'images', maxCount: 10 }]),productcontrol.editpro)//editing product
//delte requests//
router.post("/products/:id",productcontrol.deleteproduct)//delte products
router.get("/products/:id/edit",productcontrol.editproduct)

//categoriespage//
//====================
//GET requests
router.get("/adminhome/catandsub",homecontrol.cate)//rendering categoris page
//delete requests//
router.delete('/adminhome/category/:id',homecontrol.deletecate)//deleting categries fully with images and products
//post request//
router.post('/adminhome/category/:id',homecontrol.editcate)//editing category
router.post('/adminhome/subcategory/:id',homecontrol.editsubcate)//editing sub category
module.exports = router;
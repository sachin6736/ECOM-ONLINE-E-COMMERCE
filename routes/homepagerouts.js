const express = require("express");
const router = express.Router();


const autherization = require('../middleware/autherization');
const homepagecontroller=require("../controllers/usercontrollers/homepagecontroller");
const cartwishorcontroller = require("../controllers/usercontrollers/cartwishorcontroller"); 
//get requests
router.get("/homepage",homepagecontroller.homepage);//rendering homepage
router.get("/adress",homepagecontroller.adress);//rendering adress page
router.get("/viewproduct/products/:id",homepagecontroller.productlisting)//rendering productlist page
router.get("/cart",cartwishorcontroller.viewcar);//rendering cartpage
router.get('/orders',cartwishorcontroller.order);
//post requests
router.post("/adress",homepagecontroller.adresschange);
router.post('/cart/add',cartwishorcontroller.addcart);//adding products to cart
router.post("/cart/remove",cartwishorcontroller.deletecart)//deleting from cart
router.post("/cart/update",cartwishorcontroller.updatrproduct);
module.exports = router;
const express=require("express");
const multer  = require('multer')
const {claudinary,storage}=require("../claudinaryConfig.js");
const upload = multer({ storage });
const router=express.Router();
let wrapAsync=require("../utils/wrapAsync");
let {IsLoggin, isOwner, checkValidation}= require("../utils/middleware.js");
const listingController=require("../controllers/listing.js");
  
//show route
router.route("/")
  .get(wrapAsync(listingController.showListing))
  .post(IsLoggin,upload.single("Listing[image]"),checkValidation ,wrapAsync( listingController.submitListingForm));
 
 //fetch add new form
 router.get("/new",IsLoggin, listingController.addListingForm);
 
 //detail show
 router.route("/:id")
 .get(wrapAsync( listingController.ListingDetail))
 .patch(IsLoggin,isOwner,upload.single("image.url"),wrapAsync(listingController.submitUpdateForm))
 .delete(IsLoggin,isOwner, wrapAsync(listingController.destroyListing));


//update 
router.get("/:id/edit", wrapAsync(listingController.UpdateListingForm));


module.exports=router;
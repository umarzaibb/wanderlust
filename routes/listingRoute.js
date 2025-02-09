const express=require("express");
const router=express.Router();
let wrapAsync=require("../utils/wrapAsync");
let {IsLoggin, isOwner, checkValidation}= require("../utils/middleware.js");
const listingController=require("../controllers/listing.js");
  
//show route
router.route("/")
  .get(wrapAsync(listingController.showListing))
  .post(IsLoggin,checkValidation ,wrapAsync( listingController.submitListingForm));
 
 //fetch add new form
 router.get("/new",IsLoggin, listingController.addListingForm);
 
 //detail show
 router.route("/:id")
 .get(wrapAsync( listingController.ListingDetail))
 .patch(checkValidation ,isOwner,wrapAsync(listingController.submitUpdateForm))
 .delete(isOwner, wrapAsync(listingController.destroyListing));


//update 
router.get("/:id/edit", wrapAsync(listingController.UpdateListingForm));


module.exports=router;
const express=require("express");
const router=express.Router({mergeParams:true}); //mergeParams provides req body data in app.js in this router
const Review=require("../models/reviewsModel.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {checkValidationReview, IsLoggin,isReviewOwner}=require("../utils/middleware.js");
const reviewController=require("../controllers/review.js");


// Review posting
router.post("/review",IsLoggin,checkValidationReview,
   wrapAsync(reviewController.submitReview));
 
 //DELETE reviews
 router.delete("/review/:reviewId",IsLoggin,isReviewOwner, 
  wrapAsync(reviewController.destroyReview));
 

 module.exports=router;

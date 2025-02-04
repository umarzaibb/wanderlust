const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/reviewsModel.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expresserror.js");
const ReviewValidation=require("../validation/reviewValidation.js");
const Listing=require("../models/dbModel"); 


function checkValidationReview(req,res,next){
  let result=ReviewValidation.validate(req.body.review);
  if(result.error){
    throw new ExpressError(400, result.error.message);
  }else{
    next();
  }

}

// Review posting
router.post("/review",checkValidationReview, wrapAsync(async(req,res,next)=>{
    let data=req.body.review;
    let {id}= req.params;
    let review=new Review(data);
    let user=await Listing.findById(id);
    user.review.push(review);
    await review.save();
    await user.save().then(
      req.flash("success", "Review posted successfully!")
    );
 
    res.redirect(`/listing/${id}`);
 }));
 
 //DELETE reviews
 router.delete("/review/:reviewId", wrapAsync(async(req,res)=>{
       let {id, reviewId}= req.params;
       await Listing.findByIdAndUpdate(id ,{$pull: {review: reviewId}});
       await Review.findByIdAndDelete(reviewId).then(
        req.flash("success" , "Deleted Review!"),
       );;;
       res.redirect(`/listing/${id}`);
 }));
 

 module.exports=router;

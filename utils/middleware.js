let Listing=require("../models/dbModel");
let ExpressError=require("../utils/expresserror.js");
const Schema = require("../validation/schema.js");
let Review=require("../models/reviewsModel.js");
const ReviewValidation=require("../validation/reviewValidation.js");

module.exports.IsLoggin=(req,res,next)=>{
    req.session.redirectUrl=req.originalUrl;
    if(!req.isAuthenticated()){    //isAuthenticated checks whether user is authenticated or not
       req.flash("error", "You need to login first!");
        return res.redirect("/login")
    }
    next();
}

module.exports.SaveURL= (req,res,next)=>{
    res.locals.redirectUrl= req.session.redirectUrl;
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let user=await Listing.findById(id).populate("owner");
 if(!user.owner._id.equals(req.user._id)){
     req.flash("error", "You are not owner of listing!");
     return res.redirect(`/listing/${id}`);
 }
 next();
}

module.exports.checkValidation=(req,res,next)=>{
    let result=Schema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressError(400, result.error.message);
    }else{
      next();
    } 
  }

module.exports.checkValidationReview=(req,res,next)=>{
    let result=ReviewValidation.validate(req.body.review);
    if(result.error){
      throw new ExpressError(400, result.error.message);
    }else{
      next();
    }
  
  }

  module.exports.isReviewOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
 if(!review.created_by.equals(req.user._id)){
     req.flash("error", "You did'nt created this review!");
     return res.redirect(`/listing/${id}`);
 }
 next();
}
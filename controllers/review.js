const Review=require("../models/reviewsModel.js");
const Listing=require("../models/dbModel"); 

module.exports.submitReview=async(req,res,next)=>{
    let data=req.body.review;
    data.created_by=req.user._id;
    let {id}= req.params;
    let review=new Review(data);
    console.log(review);
    let user=await Listing.findById(id);
    user.review.push(review);
    await review.save();
    await user.save().then(
      req.flash("success", "Review posted successfully!")
    );
 
    res.redirect(`/listing/${id}`);
};

module.exports.destroyReview=async(req,res)=>{
       let {id, reviewId}= req.params;
       await Listing.findByIdAndUpdate(id ,{$pull: {review: reviewId}});
       await Review.findByIdAndDelete(reviewId).then(
        req.flash("success" , "Deleted Review!"),
       );
       res.redirect(`/listing/${id}`);
};
const express=require("express");
const app=express();
const Listing=require("./models/dbModel");
const mongoose = require('mongoose');
const path=require("path");
var methodOverride = require('method-override');
let  ejsMate= require('ejs-mate');
let wrapAsync=require("../wanderlust/utils/wrapAsync");
let ExpressError=require("../wanderlust/utils/expresserror.js");
const Joi = require('joi');
const Schema = require("./validation/schema.js");
const Review=require("./models/reviewsModel.js");
const ReviewValidation=require("./validation/reviewValidation.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

function checkValidation(req,res,next){
  let result=Schema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400, result.error.message);
  }else{
    next();
  }

}

function checkValidationReview(req,res,next){
  let result=ReviewValidation.validate(req.body.review);
  if(result.error){
    throw new ExpressError(400, result.error.message);
  }else{
    next();
  }

}

app.listen("8080", (req,res)=>{
    console.log("listening on port 8080:");
});


//show route
app.get("/", async(req,res)=>{
   let data=await Listing.find({});
   res.render("listings/index.ejs", {data});
})

//fetch add new form
app.get("/listing/new", (req,res)=>{
    res.render("listings/add.ejs");
});

app.post("/listing",checkValidation ,wrapAsync( async(req,res,next)=>{
 try{
  let data=req.body;
  let newListing=new Listing(data);
  await newListing.save();
  res.redirect("/");
 }catch(err){
  next(err);
 }
}));

//detail show
app.get("/listing/:id",wrapAsync( async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate("review");
    if(!data){
      throw new ExpressError(400, "Invalid Id!");
    }
    res.render("listings/detail.ejs", {data});
}));

//update 
app.get("/listing/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    res.render("listings/update.ejs", {data});
});

app.patch("/listing/:id",checkValidation ,wrapAsync( async(req,res,next)=>{
  let {id}=req.params;
  function removeEmptyStrings(obj) {
   // Create a new object to store the result
   const newObj = {};
 
   // Loop through each key in the object
   for (const key in obj) {
     // Check if the value is not an empty string
     if (obj[key] !== "") {
       // Add the key-value pair to the new object
       newObj[key] = obj[key];
     }
   }
 
   return newObj;
 }
if(!req.body){
  throw new ExpressError(400, "Invalid Data!");
}
 const result = removeEmptyStrings(req.body);
  await Listing.updateOne({"_id": id}, result);
  res.redirect(`/listing/${id}`);
}));

app.delete("/listing/:id", async(req,res)=>{
  let {id}= req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/");
});

// Review posting
app.post("/listing/:id/review",checkValidationReview, wrapAsync(async(req,res,next)=>{
   let data=req.body.review;
   let {id}= req.params;
   let review=new Review(data);
   let user=await Listing.findById(id);
   user.review.push(review);
   await review.save();
   await user.save();

   res.redirect(`/listing/${id}`);
}));

//DELETE reviews
app.delete("/listing/:id/review/:reviewId", wrapAsync(async(req,res)=>{
      let {id, reviewId}= req.params;
      await Listing.findByIdAndUpdate(id ,{$pull: {review: reviewId}});
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/listing/${id}`);
}));

//Error handlers
app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500, message="Something is wrong!"}=err;
  res.status(statusCode).render("listings/error.ejs", {message});
});
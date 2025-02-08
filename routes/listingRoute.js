const express=require("express");
const router=express.Router();
const Listing=require("../models/dbModel"); 
let wrapAsync=require("../utils/wrapAsync");
let ExpressError=require("../utils/expresserror.js");
const Schema = require("../validation/schema.js");
const Joi = require('joi');
let {IsLoggin, isOwner, checkValidation}= require("../utils/middleware.js");
const { mongoose } = require("mongoose");
const { populate } = require("../models/user.js");
  
//show route
router.get("/", async(req,res)=>{
    let data=await Listing.find({});
    res.render("listings/index.ejs", {data});
 })
 
 //fetch add new form
 router.get("/new",IsLoggin, (req,res)=>{
     res.render("listings/add.ejs");
 });
 
 router.post("/",IsLoggin,checkValidation ,wrapAsync( async(req,res,next)=>{
  try{
   let data=req.body;
   data.owner=req.user;
   let newListing=new Listing(data, req.user);
   
   await newListing.save().then(
   req.flash("success" , "Successfully added new listing"),
  );
   res.redirect("/listing");
  }catch(err){
   next(err);
  }
 }));
 
 //detail show
 router.get("/:id",wrapAsync( async(req,res)=>{
     let {id}=req.params;
     let data=await Listing.findById(id)
     .populate({path: "review" , populate: {path: "created_by"}})
     .populate("owner");
     
     if(!data){
      req.flash("error", "Listing not found");
      res.redirect("/listing");
     }
     res.locals.user=req.user;
     res.render("listings/detail.ejs", {data});
 }));

 

//update 
router.get("/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data){
      req.flash("error", "Listing not found");
      res.redirect("/listing");
    }
    res.render("listings/update.ejs", {data});
});

router.patch("/:id",checkValidation ,isOwner,wrapAsync( async(req,res,next)=>{
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
 let user=await Listing.findByIdAndUpdate(id, result);
   req.flash("success", "Updated Listing successfully!");
 res.redirect(`/listing/${id}`);
}));

router.delete("/:id",isOwner, async(req,res)=>{
  let {id}= req.params;
  await Listing.findByIdAndDelete(id).then(
    req.flash("success" , "Deleted listing!"),
   );;
  res.redirect("/listing");
});

module.exports=router;
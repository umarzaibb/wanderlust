const express=require("express");
const router=express.Router();
const Listing=require("../models/dbModel"); 
let wrapAsync=require("../utils/wrapAsync");
let ExpressError=require("../utils/expresserror.js");
const Schema = require("../validation/schema.js");
const Joi = require('joi');

function checkValidation(req,res,next){
    let result=Schema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressError(400, result.error.message);
    }else{
      next();
    } 
  }

  
//show route
router.get("/", async(req,res)=>{
    let data=await Listing.find({});
    res.render("listings/index.ejs", {data});
 })
 
 //fetch add new form
 router.get("/new", (req,res)=>{
     res.render("listings/add.ejs");
 });
 
 router.post("/",checkValidation ,wrapAsync( async(req,res,next)=>{
  try{
   let data=req.body;
   let newListing=new Listing(data);
   await newListing.save();
   res.redirect("/listing");
  }catch(err){
   next(err);
  }
 }));
 
 //detail show
 router.get("/:id",wrapAsync( async(req,res)=>{
     let {id}=req.params;
     let data=await Listing.findById(id).populate("review");
     if(!data){
       throw new ExpressError(400, "Invalid Id!");
     }
     res.render("listings/detail.ejs", {data});
 }));

 

//update 
router.get("/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    res.render("listings/update.ejs", {data});
});

router.patch("/:id",checkValidation ,wrapAsync( async(req,res,next)=>{
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

router.delete("/:id", async(req,res)=>{
  let {id}= req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

module.exports=router;
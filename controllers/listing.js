const Listing=require("../models/dbModel.js"); 
let ExpressError=require("../utils/expresserror.js");

module.exports.showListing=async(req,res)=>{
    let data=await Listing.find({});
    res.render("listings/index.ejs", {data});
 }

module.exports.addListingForm=(req,res)=>{
    res.render("listings/add.ejs");
};

module.exports.submitListingForm=async(req,res,next)=>{
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
   };

module.exports.ListingDetail=async(req,res)=>{
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
};

module.exports.UpdateListingForm=async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data){
      req.flash("error", "Listing not found");
      res.redirect("/listing");
    }
    res.render("listings/update.ejs", {data});
};

module.exports.submitUpdateForm= async(req,res,next)=>{
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
  };

  module.exports.destroyListing=async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id).then(
      req.flash("success" , "Deleted listing!"),
     );;
    res.redirect("/listing");
  };
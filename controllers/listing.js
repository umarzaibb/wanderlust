const Listing=require("../models/dbModel.js"); 
let ExpressError=require("../utils/expresserror.js");
const {GEOCODE}=require("../utils/geocoding.js");

module.exports.showListing=async(req,res)=>{
    let data=await Listing.find({});
    res.render("listings/index.ejs", {data});
 }

module.exports.addListingForm=(req,res)=>{
    res.render("listings/add.ejs");
};

module.exports.submitListingForm=async(req,res,next)=>{

     let {path,filename}=req.file;
     let {title, description, price, country, location}=req.body;
     let data={
      title,
      description,
      price,
      country,
      location,
      image:{
        filename,
        url: path
      },
      owner: req.user
     }
     await GEOCODE(location,country).then((result)=>{
      console.log(result.lat +"  "+ result.lon);
      data.geometry={
        type:"Point",
        "coordinates" : [
       result.lon, result.lat
     ]
  }
   data.owner=req.user;
     console.log(data);
     let newListing=new Listing(data);
        newListing.save().then(
     req.flash("success" , "Successfully added new listing"),
    );
     res.redirect("/listing");
    
 
     })
     .catch((err)=>{next(err)})
    //  data.owner=req.user;
    //  console.log(data);
    //  let newListing=new Listing(data);
    //  newListing.save().then(
    //  req.flash("success" , "Successfully added new listing"),
    // );
    //  res.redirect("/listing");
    // }catch(err){
    //  next(err);
    //  }
   };

module.exports.ListingDetail=async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id)
    .populate({path: "review" , populate: {path: "created_by"}})
    .populate("owner").populate("geometry");
    
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
    let lowQualityImg=data.image.url.replace("/upload", "/upload/q_10");
    res.render("listings/update.ejs", {data, lowQualityImg});
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
   const result = removeEmptyStrings(req.body.listing);
   console.log(result);
   let user=await Listing.findByIdAndUpdate(id, result);
   console.log(user);
   if(req.file){
    let {path,filename}=req.file;
    user.image.url=path;
    user.image.filename=filename;
    user.save();
   }
   console.log(user);
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
const express=require("express");
const app=express();
const Listing=require("./models/dbModel");
const mongoose = require('mongoose');
const path=require("path");
var methodOverride = require('method-override');
let  ejsMate= require('ejs-mate');


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

app.post("/listing", (req,res)=>{
  let data=req.body;
  let newListing=new Listing(data);
  newListing.save();
  res.redirect("/");
});

//detail show
app.get("/listing/:id", async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    res.render("listings/detail.ejs", {data});
});

//update 
app.get("/listing/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    console.log(data);
    res.render("listings/update.ejs", {data});
});

app.patch("/listing/:id", async(req,res)=>{
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

  const result = removeEmptyStrings(req.body);
  console.log(result); 
   await Listing.updateOne({"_id": id}, result);
   res.redirect(`/listing/${id}`);
});

app.delete("/listing/:id", async(req,res)=>{
  let {id}= req.params;
  await Listing.deleteOne({"_id": id});
  res.redirect("/");
});
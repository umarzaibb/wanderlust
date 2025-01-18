const express=require("express");
const app=express();
const Listing=require("./models/dbModel");
const mongoose = require('mongoose');
const path=require("path");
var methodOverride = require('method-override');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

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
   res.render("index.ejs", {data});
})

//fetch add new form
app.get("/listing/new", (req,res)=>{
    res.render("add.ejs");
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
    res.render("detail.ejs", {data});
});

//update 
app.get("/listing/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    res.render("update.ejs", {data});
});


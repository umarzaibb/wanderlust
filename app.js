const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
var methodOverride = require('method-override');
let  ejsMate= require('ejs-mate');
const ExpressError=require("./utils/expresserror.js");

//routes
const ListingRoute=require("./routes/listingRoute.js");
const ReviewRoute=require("./routes/reviewRoute.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//routes
app.use("/listing", ListingRoute );
app.use("/listing/:id", ReviewRoute);


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.listen("8080", (req,res)=>{
    console.log("listening on port 8080:");
});


//Error handlers
app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500, message="Something is wrong!"}=err;
  res.status(statusCode).render("listings/error.ejs", {message});
});
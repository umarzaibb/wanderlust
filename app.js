
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
var methodOverride = require('method-override');
let  ejsMate= require('ejs-mate');
const ExpressError=require("./utils/expresserror.js");
const Passport=require("passport");
const PassportConfig=require("./authentication/passport.js");
let dbURL=process.env.ATLAS_DB_URL;

const cookieParser=require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore=require("connect-mongo");

let sessionOptions={
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  secret: "MySuperSecretCodeHere!",
  cookie: { 
    httpOnly:true,
    expires: Date.now()+ 3*24*60*60*1000,
    maxAge: 3*24*60*60*1000
  },
   store : MongoStore.create({
    mongoUrl: dbURL, 
    crypto: {
    secret: 'MySuperSecretCodeHere!'
  },
    touchAfter: 24 * 3600 // time period in seconds
  })
};

//routes
const ListingRoute=require("./routes/listingRoute.js");
const ReviewRoute=require("./routes/reviewRoute.js");
const UserRoute=require("./routes/signupRoute.js");
const passport = require("passport");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser=req.user;
  next();
});


//routes
app.use("/listing", ListingRoute );
app.use("/listing/:id", ReviewRoute);
app.use("/", UserRoute);

app.get("/" ,(req,res)=>{
  res.redirect("/listing");
});


main().then(()=> console.log("Connected DB successfully!")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
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
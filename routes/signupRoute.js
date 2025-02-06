const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const PassportConfig=require("../authentication/passport.js");
const Passport=require("passport");

router.get("/signup", wrapAsync(async(req,res)=>{
   res.render("user/signup.ejs");
}));

router.post("/signup",wrapAsync( async(req,res)=>{
   try{
   let {username, email, password}=req.body;
   let user=new User({username,email});
   let result=await User.register(user, password);
   req.flash("success", "Successfully Signup, Welcome to Wanderlust!");
   res.redirect("/listing");
   }catch(err){
    req.flash("error", err.message);
    res.redirect("/signup");
   }
}));

router.get("/login", (req,res)=>{
   res.render("user/login.ejs");
});

let Auth=Passport.authenticate('local', { failureRedirect: '/login',failureFlash:true,failureMessage:true });

router.post("/login",Auth, (req,res)=>{
  req.flash("success", "Successfully Login!");
  res.redirect(req.originalUrl);
});
module.exports=router;
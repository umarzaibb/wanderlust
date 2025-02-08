const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const PassportConfig=require("../authentication/passport.js");
const Passport=require("passport");
let {SaveURL}=require("../utils/middleware.js");
const ExpressError = require("../utils/expresserror.js");

router.get("/signup", wrapAsync(async(req,res)=>{
   res.render("user/signup.ejs");
}));

router.post("/signup",wrapAsync( async(req,res)=>{
   try{
   let {username, email, password}=req.body;
   let user=new User({username,email});
   let result=await User.register(user, password);
   req.login(user, function(err){
     if(err){ req.flash("error", "Failed to Login after Signup");
      return res.redirect("/login");
     }
     req.flash("success", "Successfully Signup, Welcome to Wanderlust!");
     res.redirect("/listing");
   })
   }catch(err){
    req.flash("error", err.message);
    res.redirect("/signup");
   }
}));

router.get("/login", (req,res)=>{
   res.cookie.redirectUrl=req.session.redirectUrl;
   res.render("user/login.ejs");
});

let Auth=Passport.authenticate('local', { failureRedirect: '/login',failureFlash:true,failureMessage:true });

router.post("/login",SaveURL,Auth, (req,res)=>{
  req.flash("success", "Successfully Login!");
  if(!res.locals.redirectUrl) res.locals.redirectUrl="/listing";
  res.redirect(res.locals.redirectUrl);
});

router.get("/logout", (req,res)=>{
   req.logout(function(err){
      req.flash("error", "Failed to Logout!");
   });
   res.redirect("/listing");
})

module.exports=router;
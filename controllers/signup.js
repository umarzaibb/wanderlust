const PassportConfig=require("../authentication/passport.js");
const Passport=require("passport");
const User=require("../models/user.js");
let {SaveURL}=require("../utils/middleware.js");
const ExpressError = require("../utils/expresserror.js");

module.exports.getSignupForm=async(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.submitSignup= async(req,res)=>{
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
};

module.exports.getLoginForm=(req,res)=>{
    res.cookie.redirectUrl=req.session.redirectUrl;
    res.render("user/login.ejs");
}

module.exports.submitLogin=(req,res)=>{
    req.flash("success", "Successfully Login!");
    if(!res.locals.redirectUrl) res.locals.redirectUrl="/listing";
    res.redirect(res.locals.redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout(function(err){
       req.flash("error", "Failed to Logout!");
    });
    res.redirect("/listing");
};
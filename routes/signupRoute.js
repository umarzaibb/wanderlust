const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Passport=require("passport");
let {SaveURL}=require("../utils/middleware.js");
const signupController=require("../controllers/signup.js");

//signup
router.route("/signup")
  .get(wrapAsync(signupController.getSignupForm))
  .post(wrapAsync(signupController.submitSignup));

let Auth=Passport.authenticate('local', { failureRedirect: '/login',failureFlash:true,failureMessage:true });

router.route("/login")
  .get(signupController.getLoginForm)
  .post(SaveURL,Auth, signupController.submitLogin);

//logout
router.get("/logout", signupController.logout);

module.exports=router;
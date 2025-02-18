const mongoose = require('mongoose');

let UserSchema=new mongoose.Schema({
    email: {
        type: String,
    }
});

UserSchema.plugin(require("passport-local-mongoose"));
let User=mongoose.model("User", UserSchema);

module.exports=User;
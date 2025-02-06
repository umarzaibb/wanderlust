const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let UserSchema=new mongoose.Schema({
    email: {
        type: String,
    }
});

UserSchema.plugin(require("passport-local-mongoose"));
let User=mongoose.model("User", UserSchema);

module.exports=User;
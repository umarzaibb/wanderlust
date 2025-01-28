const mongoose = require('mongoose');
const data=require("./data.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let ListingSchema=new mongoose.Schema({
    title: {
        type : String,
    },

    description: {
        type: String,
    },
    price:  {
        type : Number
    },
    location:  {
        type : String,
    },
    country:  {
        type : String,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url : {
            type: String,
            default: "https://unsplash.com/photos/a-woman-standing-in-a-bedroom-looking-out-the-window-zMPnsd9IzIo",
            set: (v)=>
                v===""? "https://unsplash.com/photos/a-woman-standing-in-a-bedroom-looking-out-the-window-zMPnsd9IzIo" : v,
            
        }
    }
});

let Listings= new mongoose.model("listings", ListingSchema);

Listings.insertMany(data.data);

module.exports=Listings;
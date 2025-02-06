const mongoose = require('mongoose');
const data=require("./userData.js");
const reviews=require("./reviewsModel.js");

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
    },
    review: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "review"
        }
    ]
});

ListingSchema.post("findOneAndDelete",async (listing)=>{
   if(listing){
    await reviews.deleteMany({_id: {$in: listing.review}});
   }
   console.log("done")
} );

let Listings= new mongoose.model("listings", ListingSchema);


Listings.insertMany(data.data);

module.exports=Listings;
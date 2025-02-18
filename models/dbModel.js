const mongoose = require('mongoose');
const data=require("./userData.js");
const reviews=require("./reviewsModel.js");
const User=require("./user.js");


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
        },
        url : {
            type: String,
        }
    },
    review: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required:true
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
});

ListingSchema.post("findOneAndDelete",async (listing)=>{
   if(listing){
    await reviews.deleteMany({_id: {$in: listing.review}});
   }
   console.log("done")
} );

let Listings= new mongoose.model("listings", ListingSchema);

function insertInDB(){
    for(let i of data.data){
        i.owner=new mongoose.Types.ObjectId('67a4d2dde898c8ab74b6199c');
    }
}

// insertInDB();
// Listings.insertMany(data.data);
module.exports=Listings;
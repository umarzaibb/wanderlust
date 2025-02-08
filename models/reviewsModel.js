const mongoose=require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

let reviewSchema=mongoose.Schema({
    comment:{
        type: String
    },
    rating:{
        type: Number
    },
    created_at: {
        type :Date,
        default: Date.now()
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }
});


let review=mongoose.model("review", reviewSchema);


module.exports=review;
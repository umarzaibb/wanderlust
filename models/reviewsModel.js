const mongoose=require("mongoose");

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
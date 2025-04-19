const mongoose=require("mongoose");
const Schema =mongoose.Schema;



const listingSchema=new Schema({
    title: {
        type:String,
        required:true,
    },    
    description:String,
    image: {
        type: {
          filename: {
            type: String,
            default: "listingimage"
          },
          url: {
            type: String,
            default: "https://unsplash.com/photos/a-boat-is-in-the-water-in-front-of-a-house-Jjv_TInGkNc",
            set: (v) =>
              v === ""
                ? "https://unsplash.com/photos/a-boat-is-in-the-water-in-front-of-a-house-Jjv_TInGkNc"
                : v,
          },
        },
        default: undefined, // Allows Mongoose to use nested defaults
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
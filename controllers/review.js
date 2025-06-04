const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

// create Review
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listings/${listing._id}`);
};

// Delete Review
module.exports.deleteReview=async(req,res)=>{
     let {id, reviewID} =req.params;
     await Listing.findByIdAndUpdate(id , {$pull :{review: reviewID}});
     await Review.findByIdAndDelete(reviewID);
     req.flash("review deleted");
     res.redirect(`/listings/${id}`);
};
const express=require("express");
const router=express.Router({mergeParams : true});
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema , reviewSchema} =require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing,validateReview,isReviewAuthor}=require("../middleware.js");


// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         // el.message is already a string
//         const errmsg = error.details.map(el => el.message).join(', ');
//         throw new ExpressError(400, errmsg);
//     } else {
//         next();
//     }
// };

// REVIEWS
//POST ROUTE
router.post("/",isLoggedIn,validateReview, wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW ROUTE 
router.delete("/:reviewID",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
     let {id, reviewID} =req.params;
     await Listing.findByIdAndUpdate(id , {$pull :{review: reviewID}});
     await Review.findByIdAndDelete(reviewID);
     req.flash("review deleted");
     res.redirect(`/listings/${id}`);
}));

module.exports=router;

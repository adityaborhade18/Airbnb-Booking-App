const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const {listingSchema , reviewSchema} =require("../schema.js");
// const ExpressError=require("../utils/ExpressError.js"); 
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

// const validateListing=(req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//     let errmsg = error.details.map((el) => el.message).join(",");
//          throw new ExpressError(400, errmsg);
//     }
//     else{
//         next();
//     }
// }



//INDEX ROUTE
router.get('/',wrapAsync(async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//NEW ROUTE //
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be Login to create a Listing!");
    //     return res.redirect("/login");
    // }
    res.render("./listings/new.ejs");
});

// CREATE ROUTE //
router.post("/",isLoggedIn,validateListing ,wrapAsync(async(req,res,next)=>{
   // let {title,description,image,price,location,country} =req.body;
   //const listing=req.body.listing;
    
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Enter a valid data");
    // }
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    console.log(newlisting);
    req.flash("success", "new listing created!");
    res.redirect("/listings");
}));

// SHOW ROUTE 
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listings=await Listing.findById(id)
    .populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate("owner");
  if(!listings){
    req.flash("error","Listing you requested for deos not exist!");
    res.redirect("/listings");
  }
    res.render("./listings/show.ejs",{listings});
}));

//EDIT ROUTE //
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing})
}));

// UPDATE ROUTE //
router.put("/:id",isLoggedIn,isOwner,validateListing ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    /*let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
          req.flash("error","you dont have permission to update this listing !");
          return res.redirect(`/listings/${id}`);
    // } */
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing is Updated!");
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE //
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const deleted=await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports=router;

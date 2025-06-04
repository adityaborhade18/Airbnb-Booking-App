const Listing=require("../models/listing.js");

// index route 
module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

// render form to create new listing
module.exports.renderNewForm= (req,res)=>{
    res.render("./listings/new.ejs");
};

// post form of created newlisting 
module.exports.createListing= async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    console.log(newlisting);
    req.flash("success", "new listing created!");
    res.redirect("/listings");
};

// Show Route 
module.exports.showListing=async(req,res)=>{
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
};

//Edit Listing
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing})
};

// Update Listing
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== 'undefined'){
        let url= req.file.path;
        let filename=req.file.filename;
        
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

// Delete Listing
module.exports.deleteListing=async(req,res)=>{
    let {id} =req.params;
    const deleted=await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}
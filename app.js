const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} =require("./schema.js");
const Review=require("./models/review.js");
const e = require("express");
const session = require("express-session");
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// saving to database is a asynchronous thats why i use async-await 
/*app.get("/testListing" , async(req,res)=>{
    let sampleListing=new Listing({
        title:"my new villa",
        description:"By the beach",
        price: 12000,
        location: "marine Drive, Mumbai",
        country:"India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("sucessful testing");
}); */

const sessionOptions={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie:{
        expire: Date.now() + 7*24*60*60*3600,
        maxAge:  7*24*60*60*3600,
        httpOnly : true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/" , (req,res)=>{
    res.send("i am root");
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.get("/demouser" , async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"sigma-student",
    })
    let registerUser=await User.register(fakeUser,"helloworld");
    res.send(registerUser);
})

/*
const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
    let errmsg=error.details.map((el)=>el.message.join(","));
        throw new ExpressError(400, errmsg);
    }
    else{
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // el.message is already a string
        const errmsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};
*/ 

//INDEX ROUTE 
// app.get('/listings',wrapAsync(async(req,res)=>{
//     const allListings= await Listing.find({});
//     res.render("./listings/index.ejs",{allListings});
// }));

/*
//NEW ROUTE //
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

// CREATE ROUTE //
app.post("/listings",validateListing ,wrapAsync(async(req,res,next)=>{
   // let {title,description,image,price,location,country} =req.body;
   //const listing=req.body.listing;
    
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Enter a valid data");
    // }
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting);
    res.redirect("/listings");
}));

// SHOW ROUTE 
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listings=await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listings});
}));

//EDIT ROUTE //
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing})
}));

// UPDATE ROUTE //
app.put("/listings/:id",validateListing ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE //
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const deleted=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})); */

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);

/*
// REVIEWS
//POST ROUTE
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW ROUTE 
app.delete("/listings/:id/reviews/:reviewID",wrapAsync(async(req,res)=>{
     let {id, reviewID} =req.params;
     await Listing.findByIdAndUpdate(id , {$pull :{review: reviewID}});
     await Review.findByIdAndDelete(reviewID);
     res.redirect(`/listings/${id}`);
}));
 */

app.use((req,res,next)=>{
   next(new ExpressError(404," this route dosent exist !"))
})

app.use((err,req,res,next)=>{
   let {status=500, message="something went wrong !"} =err;
   res.status(status).render("./listings/error.ejs",{err});
});      


app.listen(8080,()=>{
    console.log(`The server is up and running`);
});
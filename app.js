require("dotenv").config();
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
const MongoStore=require("connect-mongo");
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");


const DB_URL=process.env.ATLAS_URL;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(DB_URL);
}

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store=MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error" , (err)=>{
    console.log("error in mongo session store ",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
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
    res.render('index.ejs');
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);




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
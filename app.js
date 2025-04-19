const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


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

app.get("/" , (req,res)=>{
    res.send("i am root");
});

//INDEX ROUTE 
app.get('/listings',async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//NEW ROUTE //
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

// CREATE ROUTE //
app.post("/listings" ,async(req,res)=>{
   // let {title,description,image,price,location,country} =req.body;
   //const listing=req.body.listing;
   const newlisting=new Listing(req.body.listing);
   await newlisting.save();
   console.log(newlisting);
   res.redirect("/listings");
});

// SHOW ROUTE 
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listings=await Listing.findById(id);
    res.render("./listings/show.ejs",{listings});
});

//EDIT ROUTE //
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing})
});

// UPDATE ROUTE //
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//DELETE ROUTE //
app.delete("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    const deleted=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log(`The server is up and running`);
});
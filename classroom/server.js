const e = require("express");
const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOption={
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized : true,
}
app.use(session(sessionOption));
app.use(flash());

app.get("/register", (req,res)=>{
    let {name="virat"} =req.query;
    req.session.name=name;
    req.flash("success", ` ${req.session.name} registerd successfully !`)
    res.redirect("/hello");
})
app.get("/hello" , (req,res)=>{
    // res.render("page.ejs", {name: req.session.name, msg:req.flash("success")});
    // as we are sending variables during rendering like name and msg , we can also do it by following 
    res.locals.message=req.flash("success");
    res.render("page.ejs",{name: req.session.name});
})
// app.get("/test", (req,res)=>{
//     res.send("test successful");
// })

// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// })

app.listen(3030, ()=>{
    console.log("server is running on 3000");
});
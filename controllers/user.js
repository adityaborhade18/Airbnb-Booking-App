const User=require("../models/user.js");


// signup form renders
module.exports.signupform=(req,res)=>{
    res.render('users/signup.ejs');
};

//
module.exports.signup=async(req,res)=>{
    try{
       let {username,email,password} =req.body;
       let newUser=new User({username,email});
       let registerUser=await User.register(newUser,password);
       req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderlust !");
        res.redirect("/listings");
       })
      
    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

//renders login page
module.exports.loginform=(req,res)=>{
    res.render("users/login.ejs");
};

//login
module.exports.login=async(req,res)=>{
     req.flash("success", "you are logged in!");
     let redirectUrl=res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
};

//logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return  next(err);
        }
        req.flash("success","You have Logged out !");
        res.redirect("/listings");
    })
};
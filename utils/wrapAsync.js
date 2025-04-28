// function asyncWrap(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }
// module.exports= asyncWrap;\

module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

// async wrap  := handles error automatically and forwards them to your express handleer 

            //  := u dont need to use a try-catch block 
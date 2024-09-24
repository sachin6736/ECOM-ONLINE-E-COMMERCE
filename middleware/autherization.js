const authe = (req,res,next)=>{
    if(!req.session.userId){
        req.session.errormessage = "you must login to continue" ;
        res.redirect('/login')
    }else{
        next();
    }
}

module.exports=authe;
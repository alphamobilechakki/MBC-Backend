async function userLogout(req,res){
    try{
        res.json({
            message : "Logged out successfully. Please delete the token from the client.",
            error : false,
            success : true,
            data : []
        })
    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}

export default userLogout;

import jwt from 'jsonwebtoken';

async function authToken(req,res,next){
    try{
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer header
        if(!token){
            return res.status(401).json({
                message : "Please Login to access this resource",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if(err){
                //console.log("error auth", err)
                return res.status(401).json({
                    message : "Authentication failed. Please login again.",
                    error : true,
                    success : false
                })
            }

            req.userId = decoded?._id
            req.user = decoded

            next()
        });

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            data : [],
            error : true,
            success : false
        })
    }
}


export default authToken;
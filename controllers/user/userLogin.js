import becrypt from 'bcryptjs';
import userModel from '../../models/userModel.js';
import jwt from 'jsonwebtoken';


const userLoginController = async (req,res) => {
    try{
        const {mobile} = req.body;

        const user = await userModel.findOne({mobile});

        if(!user){
            return res.status(200).json({
                hasAccount : false,
                message : "user not found",
                success : true,
                error : false
            })
         }

         const tokenData = {
            _id : user._id,
            mobile : user.mobile,
            role : user.role,
         };

         const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY,{
            expiresIn : '365d',
         });

         res.status(200).json({
            message : "Login Successfully",
            data : token , 
            success : true,
            error : false 
         });
    }catch(error){
    res.json({
        message : error.message || error,
        success : false,
        error : true
    })
}
}

export default userLoginController;

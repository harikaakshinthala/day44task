import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '../Modules/User.js';

dotenv.config()

const usersignin = async(request,response,next)=>{
    let userlogintoken;
    if(request.headers){
        try {
            userlogintoken=request.headers["user-login-token"]
            if(!userlogintoken){
                return response.status(400).json({message:"Access Denied"})
            }
    
            const decode = jwt.verify(userlogintoken,process.env.SECRET_KEY)
            request.user = await User.findById(decode.id).select("-password")
            next()
            
        } catch (error) {
            console.log("Authorization error")
            return response.status(401).json({message:"Invalid Authorization"})
        }
    }
}

export default usersignin
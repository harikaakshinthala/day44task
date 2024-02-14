import express from 'express'
import { User, generateToken } from '../Modules/User.js'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post("/",async(request,response)=>{
    try {
        // finding user
        const user = await User.findOne({email:request.body.email})
        if(!user) return response.status(400).json({message:"User Email Or Password Incorrect"})
       
        // Checks if the user has confirmed their email
        if(user.accountStatus !== true) return response.status(400).json({message:"Please Activate Your Account"})
       
       
        // verifying password
         const validatePassword = await bcrypt.compare(
            request.body.password,
            user.password
         )

         if(!validatePassword) return response.status(400).json({message:"User Email Or Password Incorrect"})
        const Token = generateToken(user._id)
         response.status(200).json({message:"Successfully Loggedin",token:Token})
    } catch (error) {
        console.log("Login error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})
export const loginRouter = router
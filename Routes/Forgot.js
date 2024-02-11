import express from 'express'
import { User, generateToken } from '../Modules/User.js'
import { Token } from '../Modules/ForgotToken.js'
import randomString from '../Email/RandomString.js'
import mail from '../Email/Emailsending.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

// dotenv configuration
dotenv.config()

const router = express.Router()


// Generates token and sends it to email
router.post("/",async(request,response)=>{
    try {
        // finds the user 
        const user = await User.findOne({email:request.body.email})
        if(!user) return response.status(400).json({message:"User Not Valid"})
        if(user.accountStatus !== true) return response.status(400).json({message:"Please Activate Your Account"})
        // generate tokenurl
        const token = generateToken(user._id)
        // generates new token
        const newToken = await new Token(
            {
                userId:user._id,
                token:token,
                tokenUrl:`${process.env.BASE_URL}/forgot/${token}`
            }
        ).save()

        if(!newToken) return response.status(400).json({message:"Token error"})

        // sending email
        mail(newToken.tokenUrl,request.body.email,"Click to change your password","Reset Your Password")
        
        response.status(200).json({message:"email has sented successfully",token:newToken})
    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})


// Validates the token 
router.get("/:token",async(request,response)=>{
    try {
        // Finding the token
        const token = await Token.findOne({token:request.params.token})
        if(!token) return response.status(400).json({message:"Your token verification timed out"})
       
        response.status(200).json({message:"You can reset your password now",tokken:token})

        
    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})

// changing password
router.put("/reset/:id",async(request,response)=>{
    try {
        // generates the encrypted password
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(request.body.password,salt)
        
        // Finds the user and changes the password
        const updatedUser = await User.findByIdAndUpdate(
            {_id:request.params.id},
            {$set:{
                password:hashedpassword
            }},
            {new:true}
        )

        if(!updatedUser) return response.status(400).json({message:"Error resetting password"})
        
        response.status(200).json({message:"Successfully password changed"})

    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})

export const forgotRouter = router
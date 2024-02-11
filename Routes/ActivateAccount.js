import express from 'express'
import { User, generateToken } from '../Modules/User.js'
import { ConfirmationMail } from '../Modules/Confirmationmail.js'
import mail from '../Email/Emailsending.js'
import dotenv from 'dotenv'

// dotenv configuration
dotenv.config()

const router = express.Router()

// user signup method
router.post("/",async(request,response)=>{
    try {
        // finding user if already exist
        const user = await User.findOne({email:request.body.email})
        if(!user)return response.status(400).json({message:"User Not Found"})
        if(user.accountStatus===true)return response.status(400).json({message:"User Account Already Activated"})
     
        // Email has already been sent list

          await ConfirmationMail.deleteMany(
            {userId:user._id}
        )
     
     
     
        // genarating random string
        const tokenurl = generateToken(user._id)

        // email confirmation process
        const newEmailConfirmationUrl = await new ConfirmationMail(
            {
                userId:user._id,
                token:tokenurl,
                confirmationUrl:`${process.env.BASE_URL}/signup/${tokenurl}`
            }
        ).save()
        // sending email
        mail(newEmailConfirmationUrl.confirmationUrl,request.body.email,"Click to activate your account","Activate Your Account")

        // sending user details
        response.status(200).json({message:"Email has been sent, please check your inbox"})

    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})

// Delete token
router.delete("/delete",async(request,response)=>{
    try {
        // finding the user
        const user = await User.find({email:request.body.email})
        if(!user) return response.status(400).json({message:"User Not Found"})
        // deleting the email url token
        const urlToken = await ConfirmationMail.deleteMany({userId:user._id})

        if(!urlToken) return response.status(400).json({message:"Error deleting URL token"})
        
        response.status(200).json({message:"Successfully URL token deleted"})
    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})




export const activationRouter = router


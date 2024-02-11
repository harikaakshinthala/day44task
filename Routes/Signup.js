import express from 'express'
import bcrypt from 'bcrypt'
import { User, generateToken } from '../Modules/User.js'
import { ConfirmationMail } from '../Modules/Confirmationmail.js'
import mail from '../Email/Emailsending.js'
import randomString from '../Email/RandomString.js'
import dotenv from 'dotenv'

// dotenv configuration
dotenv.config()

const router = express.Router()

// user signup method
router.post("/",async(request,response)=>{
    try {
        // finding user if already exist
        const oldUser = await User.findOne({email:request.body.email})
        if(oldUser)return response.status(400).json({message:"User Already Exist"})
        // generating encrypted password
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(request.body.password,salt)
        // new user
        const newUser = await new User(
            {
                firstname:request.body.firstname,
                lastname:request.body.lastname,
                email:request.body.email,
                password:hashedpassword,
                accountStatus:false
            }
        ).save()

        // genarating random string
       
        const tokenurl = generateToken(newUser._id)

        // email confirmation process
        const newEmailConfirmationUrl = await new ConfirmationMail(
            {
                userId:newUser._id,
                token:tokenurl,
                confirmationUrl:`${process.env.BASE_URL}/activate/${tokenurl}`
            }
        ).save()
        // sending email
        mail(newEmailConfirmationUrl.confirmationUrl,request.body.email,"Click to activate your account","Activate Your Account")

        // sending user details
        response.status(200).json({user:newUser,token:newEmailConfirmationUrl})

    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})

// verifying email and changing password


const signupRouter = router

export default signupRouter;
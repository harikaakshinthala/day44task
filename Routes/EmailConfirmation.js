import express from 'express'
import { ConfirmationMail } from '../Modules/Confirmationmail.js'
import { User } from '../Modules/User.js'


const router = express.Router()

// verify url and changing account status
router.put("/:id",async(request,response)=>{
    try {
        // finding token
        const oldtoken = await ConfirmationMail.findOne({token:request.params.id})
        if(!oldtoken)return response.status(400).json({message:"Confirmation timed out"})
        // changing account status
        const updatedStatus = await User.findByIdAndUpdate(
            {_id:oldtoken.userId},
            {$set:{
                accountStatus:true
            }},
            {new:true}
        )

        if(!updatedStatus)return response.status(400).json({message:"Status Updating Error"})
    
        response.status(200).json({message:"Successfully Your Account Activated"})


    } catch (error) {
        console.log("Url verification error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})

export const emailVerificationRouter = router
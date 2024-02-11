import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema

const MailSchema = new mongoose.Schema(
    {
        userId:{
            type:ObjectId,
            required:true,
            ref:"users"
        },
        token:{
             type:String,
             required:true
        },
        confirmationUrl:{
            type:String,
            required:true
        },
        Date:{
            type:Date,
            default:new Date(),
            expires:"1h"
        }
    }
)

export const ConfirmationMail = mongoose.model("mails",MailSchema)
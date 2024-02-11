import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema

const TokenSchema = new mongoose.Schema(
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
        tokenUrl:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default:new Date(),
            expires:"1h"
        }
        
    }
)

export const Token = mongoose.model("tokens",TokenSchema)
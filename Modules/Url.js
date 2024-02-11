import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema

const UrlSchema = new mongoose.Schema(
    {
        userId:{
            type:ObjectId,
            required:true,
            ref:"users"
        },
        randomString:{
            type:String,
            required:true
        },
        longUrl:{
            type:String,
            required:true
        },
        shortenedUrl:{
            type:String,
            required:true
        },
        clicks:{
            type:Number,
            default:0
        },
        date:{
            type:Date,
            default:new Date()
        }
    }
)

export const Url = mongoose.model("urls",UrlSchema)
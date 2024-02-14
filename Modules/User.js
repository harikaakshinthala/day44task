import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const UserSchema = new mongoose.Schema(
    {
        firstname:{
               type:String,
               required:true
        },
        
        lastname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        accountStatus:{
            type:Boolean,
            required:true
        }
    }
)

export const generateToken = (id) => {
  //  return jwt.sign({id},process.env.SECRET_KEY,{expiresIn:"1d"})
   return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '1d' });
}

export const User = mongoose.model("users",UserSchema)

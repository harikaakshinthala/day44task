import express from 'express';
import dotenv from 'dotenv';
import { Url } from '../Modules/Url.js';
import randomString from '../Email/RandomString.js';

// dotenv coonfiguration
dotenv.config()


const router = express.Router()

// finds all shortened urls
router.get("/all/:userId",async(request,response)=>{
    try {
        // finds all urls
        const urls = await Url.find({userId:request.params.userId})
        if(urls.length === 0) return response.status(400).json({message:"No URLs available"})
        response.status(200).json(urls)
        
    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})

// Url shortning
router.post("/:userId",async(request,response)=>{
    try {
        // finds if long url is already exists
        const oldLongUrl = await Url.findOne({userId:request.params.userId,longUrl:request.body.longUrl})
        // retuns old shortened url
        if(oldLongUrl) return response.status(200).json({
            message:"You have already shortened this url, you can re-shot this link if you delete the previous shortened link",
            previousShortenedUrl:oldLongUrl.shortenedUrl
        })

        const RandomString = randomString(5)
        // shortening new long url
        const newUrl = await new Url(
            {
                userId:request.params.userId,
                randomString:RandomString,
                longUrl:request.body.longUrl,
                shortenedUrl:`${process.env.URL_SHORTENER}/s/${RandomString}`
            }
        ).save()

        if(!newUrl)return response.status(400).json({message:"Shotening URL Error"})

        // returning the data
        response.status(200).json(newUrl)
        
    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
       
    }
})

// deleting Shortened Url
router.delete("/delete/:id",async(request,response)=>{
    try {
        // deleting the shortened url
        const url = await Url.findByIdAndDelete(request.params.id)
        if(!url) return response.status(400).json({message:"Error deleting shortened URL"})
        response.status(200).json({message:"Successfully shortened URL deleted"})
        
    } catch (error) {
        console.log("Internal server error",error)
        return response.status(500).json({message:"Internal server error"})
    }
})




export const URLRouter = router
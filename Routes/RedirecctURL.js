import express from 'express';
import { Url } from '../Modules/Url.js';




const router = express.Router()

// Redirecting Url
router.get("/s/:randomstring",async(request,response)=>{
    try {
        // finding the long url
        const longUrl = await Url.findOne({randomString:request.params.randomstring})
        if(!longUrl) return response.status(400).json({message:"Invalid URL"})
        await Url.updateOne(
            {shortenedUrl:longUrl.shortenedUrl},
            {clicks:longUrl.clicks+1}
            )

        response.redirect(longUrl.longUrl)

    } catch (error) {
        console.log("Internal server error")
        return response.status(500).json({message:"Internal server error"})
    }
})

export const redirectRouter = router
import dotenv from 'dotenv'
dotenv.config()
import Router from "express"
import { authenticateToken } from '../middleware/authenticateToken'
import ytdl from '@distube/ytdl-core'

const route = Router()

// Fetch url get title
route.post("/ytb_title", authenticateToken, async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY
    try {
        const url = new URL(req.body.url)
        const videoId = url.searchParams.get("v")
        if (!videoId) return res.status(400).send("Invalid YouTube URL")

        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
        const data = await response.json()
        const title = data.items[0]?.snippet?.title

        if (!title) return res.status(404).send("Video not found")

        res.send({ title })
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})

export default route
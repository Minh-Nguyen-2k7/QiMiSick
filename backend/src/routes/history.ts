import dotenv from 'dotenv'
dotenv.config()
import Router from "express"
import { prisma } from "../lib/prisma";
import { authenticateToken } from '../middleware/authenticateToken';

const route = Router()

// Save a mood combination
route.post("/moods", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const { moodsID } = req.body
    if (!moodsID) return res.sendStatus(400)
    const moodCombination = await prisma.moodHistory.create({
        data: {
            userId: findUser.id,
            moods: {
                connect: moodsID.map((id: number) => ({ id }))
            }
        }
    })
    res.send(moodCombination)
})

// Save a listened song
route.post("/songs", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const { songID } = req.body
    if (!songID) return res.sendStatus(400)
    const savedSong = await prisma.songHistory.create({
        data: {
            userId: findUser.id,
            songId: songID
        }
    })
    res.send(savedSong)
})

// Return 5 most recent mood combinations
route.get("/moods", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const moodCombinations = await prisma.moodHistory.findMany({
        where: {
            userId: findUser.id
        },
        take: 5,
        orderBy: { id: "desc" },
        include: { moods: true }
    })
    res.send(moodCombinations)
})

// Return 5 most recent albums
route.get("/albums", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const albums = await prisma.album.findMany({
        where: {
            userId: findUser.id
        },
        take: 5,
        orderBy: { id: "desc" }
    })
    res.send(albums)
})
// Return 10 most recent listened songs
route.get("/songs", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const recentSongs = await prisma.songHistory.findMany({
        where: {
            userId: findUser.id
        },
        take: 10,
        orderBy: { id: "desc" },
        include: {
            song: true
        }
    })
    res.send(recentSongs)
})
export default route
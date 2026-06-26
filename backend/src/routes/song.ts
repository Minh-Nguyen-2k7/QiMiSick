import dotenv from 'dotenv'
dotenv.config()
import Router from "express"
import { prisma } from "../lib/prisma";
import { authenticateToken } from '../middleware/authenticateToken';

const route = Router()

// Create a new song
route.post("/newSong", authenticateToken, async (req, res) => {
    const { title, url } = req.body
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const newSong = await prisma.song.create({
        data: {
            title: title,
            url: url,
            userId: findUser.id
        }
    })
    return res.sendStatus(201)
})

// Return all songs
route.get("/songs", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const allSongs = await prisma.song.findMany({
        where: { userId: findUser.id },
        include: { moods: true }
    })
    res.send(allSongs)
})

// Return 1 song
route.get("/songs/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const songID = Number(req.params.id)
    const findSong = await prisma.song.findUnique({
        where: { id: songID },
        include: {
            moods: true
        }
    })
    if (!findSong) return res.sendStatus(404)
    res.send(findSong)
})

// Update 1 song (song details)
route.put("/songs/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const songID = Number(req.params.id)
    const findSong = await prisma.song.findUnique({
        where: { id: songID }
    })
    if (!findSong) return res.sendStatus(404)
    const { title, url, isFavorite } = (req as any).body
    const updateSong = await prisma.song.update({
        where: {
            id: findSong.id
        },
        data: {
            title: title,
            url: url,
            isFavorite: isFavorite
        }
    })
    res.send(updateSong)
})

// Update 1 song (add 1 mood)
route.put("/songs/:songID/moods/:moodID", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const songID = Number(req.params.songID)
    const findSong = await prisma.song.findUnique({
        where: { id: songID }
    })
    if (!findSong) return res.sendStatus(404)
    const moodID = Number(req.params.moodID)
    const findmood = await prisma.mood.findUnique({
        where: { id: moodID }
    })
    if (!findmood) return res.sendStatus(404)
    const updateSong = await prisma.song.update({
        where: {
            id: findSong.id
        },
        data: {
            moods: {
                connect: { id: moodID }
            }
        }
    })
    res.send(updateSong)
})

// Update 1 song (remove 1 mood)
route.delete("/songs/:songID/moods/:moodID", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const songID = Number(req.params.songID)
    const findSong = await prisma.song.findUnique({
        where: { id: songID }
    })
    if (!findSong) return res.sendStatus(404)
    const moodID = Number(req.params.moodID)
    const findmood = await prisma.mood.findUnique({
        where: { id: moodID }
    })
    if (!findmood) return res.sendStatus(404)
    const updateSong = await prisma.song.update({
        where: {
            id: findSong.id
        },
        data: {
            moods: {
                disconnect: { id: moodID }
            }
        }
    })
    res.send(updateSong)
})

// Delete 1 song
route.delete("/songs/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const songID = Number(req.params.id)
    const findSong = await prisma.song.findUnique({
        where: { id: songID }
    })
    if (!findSong) return res.sendStatus(404)
    await prisma.song.delete({
        where: { id: findSong.id }
    })
    res.sendStatus(204)
})
export default route
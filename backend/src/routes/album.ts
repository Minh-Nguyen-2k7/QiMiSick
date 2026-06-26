import dotenv from 'dotenv'
dotenv.config()
import Router from "express"
import { prisma } from "../lib/prisma";
import { authenticateToken } from '../middleware/authenticateToken';

const route = Router()

// Create a new album
route.post("/newAlbum", authenticateToken, async (req, res) => {
    const { name } = req.body
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const newAlbum = await prisma.album.create({
        data: {
            name: name,
            userId: findUser.id
        }
    })
    return res.status(201).json(newAlbum)
})

// Return all albums
route.get("/albums", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const allAlbums = await prisma.album.findMany({
        where: { userId: findUser.id },
        include: {
            songs: {
                include: {
                    moods: true
                }
            }
        }
    })
    res.send(allAlbums)
})

// Return 1 album
route.get("/albums/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const albumID = Number(req.params.id)
    const findAlbum = await prisma.album.findUnique({
        where: { id: albumID },
        include: {
            songs: {
                include: {
                    moods: true
                }
            }
        }
    })
    if (!findAlbum) return res.sendStatus(404)
    res.send(findAlbum)
})

// Update 1 album (Album details)
route.put("/albums/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const albumID = Number(req.params.id)
    const findAlbum = await prisma.album.findUnique({
        where: { id: albumID }
    })
    if (!findAlbum) return res.sendStatus(404)
    const { name } = (req as any).body
    const updateAlbum = await prisma.album.update({
        where: {
            id: findAlbum.id
        },
        data: {
            name: name
        }
    })
    res.send(updateAlbum)
})

// Update 1 album (connect song)
route.put("/albums/:albumID/songs/:songID", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const albumID = Number(req.params.albumID)
    const findAlbum = await prisma.album.findUnique({
        where: { id: albumID }
    })
    if (!findAlbum) return res.sendStatus(404)
    const songID = Number(req.params.songID)
    const findSong = await prisma.song.findUnique({
        where: { id: songID }
    })
    if (!findSong) return res.sendStatus(404)
    const updateAlbum = await prisma.album.update({
        where: {
            id: findAlbum.id
        },
        data: {
            songs: {
                connect: { id: songID }
            }
        }
    })
    res.send(updateAlbum)
})

// Delete 1 album
route.delete("/albums/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const albumID = Number(req.params.id)
    const findAlbum = await prisma.album.findUnique({
        where: { id: albumID }
    })
    if (!findAlbum) return res.sendStatus(404)
    await prisma.album.delete({
        where: { id: findAlbum.id }
    })
    res.sendStatus(204)
})
export default route
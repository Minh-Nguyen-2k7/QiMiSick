import dotenv from 'dotenv'
dotenv.config()
import Router from "express"
import { prisma } from "../lib/prisma";
import { authenticateToken } from '../middleware/authenticateToken';

const route = Router()

// Create a new mood
route.post("/newMood", authenticateToken, async (req, res) => {
    const { name } = req.body
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    try {
        await prisma.mood.create({
            data: {
                name: name,
                userId: findUser.id
            }
        })
        return res.sendStatus(201)
    } catch (error) {
        res.status(400).send("Mood already exists")
    }
})

// Return all moods
route.get("/moods", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const allMoods = await prisma.mood.findMany({
        where: { userId: findUser.id }
    })
    res.send(allMoods)
})

// Return 1 mood
route.get("/moods/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const moodID = Number(req.params.id)
    const findMood = await prisma.mood.findUnique({
        where: { id: moodID },
        include: {
            songs: {
                include: {
                    moods: true
                }
            }
        }
    })
    if (!findMood) return res.sendStatus(404)
    res.send(findMood)
})

// Update 1 mood
route.put("/moods/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const moodID = Number(req.params.id)
    const findmood = await prisma.mood.findUnique({
        where: { id: moodID }
    })
    if (!findmood) return res.sendStatus(404)
    const { name } = (req as any).body
    const updateMood = await prisma.mood.update({
        where: {
            id: findmood.id
        },
        data: {
            name: name
        }
    })
    res.send(updateMood)
})

// Delete 1 mood
route.delete("/moods/:id", authenticateToken, async (req, res) => {
    const { username } = (req as any).user
    const findUser = await prisma.user.findFirst({
        where: { username: username }
    })
    if (!findUser) return res.send("Can't find user")
    const moodID = Number(req.params.id)
    const findmood = await prisma.mood.findUnique({
        where: { id: moodID }
    })
    if (!findmood) return res.sendStatus(404)
    await prisma.mood.delete({
        where: { id: findmood.id }
    })
    res.sendStatus(204)
})
export default route
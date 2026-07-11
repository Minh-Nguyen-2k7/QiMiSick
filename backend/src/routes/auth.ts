import dotenv from 'dotenv'
dotenv.config()
import Router from "express"
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';
import { compare } from "bcrypt"
const router = Router()


// Register Router
router.post("/register", async (req, res) => {
    const { username, password } = req.body
    if (!username) return res.send("Missing user")
    if (!password) return res.send("Missing password")
    const salt = genSaltSync(10);
    const hashedPassword = await hashSync(password, salt)
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        console.log(user)
        res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        res.status(400).json({ message: "Username already taken" })
    }
})

// Login Route
router.post("/login", async (req, res) => {
    try {
        // Authenticate User
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).send("Username and Password required")
        }
        const findUser = await prisma.user.findFirst({
            where: { username }
        })
        if (!findUser) return res.status(400).send("Invalid username")
        const isValid = await compare(password, findUser.password)
        if (!isValid) return res.status(404).send("User not found")

        // Provide user with tokens
        const accessToken = generateAccessToken({ username: username })
        const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '604800s' })
        await prisma.user.update({
            where: { id: findUser.id },
            data: { refreshToken: refreshToken }
        })
        return res.json({ accessToken: accessToken, refreshToken: refreshToken })
    } catch (error) {
        console.error("Login route failure context: ", error)
        return res.status(500).send("Internal server error")
    }
})

//Logout Route
router.delete("/logout", async (req, res) => {
    const { refreshToken } = req.body
    await prisma.user.updateMany({
        where: { refreshToken: refreshToken },
        data: {
            refreshToken: null
        }
    })
    res.sendStatus(204)
})

// Token route
router.post('/token', async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.sendStatus(401)

    // Step 1: Verify the JWT itself (signature + expiration)
    let decoded
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).send("Refresh token expired, please log in again")
        }
        // Any other verify failure = malformed/tampered/wrong-secret token
        return res.status(403).send("Invalid refresh token")
    }

    // Step 2: Check the token still matches what's on record (i.e. not revoked via logout)
    try {
        const userWithToken = await prisma.user.findFirst({
            where: { refreshToken: refreshToken }
        })
        if (!userWithToken) return res.sendStatus(403)

        const accessToken = generateAccessToken({ username: userWithToken.username })
        return res.json({ accessToken: accessToken })

    } catch (error) {
        // This catch is now ONLY for genuine server/DB failures
        console.error("Token refresh route failure context:", error)
        return res.status(500).send("Internal Server Error")
    }
})
// Delete route (For cleaning)
router.delete("/delete", async (req, res) => {
    try {
        await prisma.songHistory.deleteMany()
        await prisma.moodHistory.deleteMany()
        await prisma.song.deleteMany()
        await prisma.album.deleteMany()
        await prisma.mood.deleteMany()
        await prisma.user.deleteMany()
        res.send("Deleted")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error deleting")
    }
})
function generateAccessToken(user: Object) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '300s' })
}
export default router
import express from "express"
import authRoutes from "./routes/auth"
import songRoutes from "./routes/song"
import moodRoutes from "./routes/mood"
import albumRoutes from "./routes/album"
import historyRoutes from "./routes/history"
import fetchRoutes from "./routes/fetch"
import cors from 'cors';
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:4040",
    exposedHeaders: ["Content-Length", "Content-Range"], // Enables scrubbing tracking if needed later
    credentials: true
}
const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/song", songRoutes)
app.use("/mood", moodRoutes)
app.use("/album", albumRoutes)
app.use("/history", historyRoutes)
app.use("/fetch", fetchRoutes)
app.listen(8080, () => console.log("Server is running"))

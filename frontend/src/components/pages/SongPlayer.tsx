import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useToken } from "../context/TokenContext"
import type { SongType } from "./SongSection"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import api from "../../lib/axios"

const SongPage = () => {
    const { id } = useParams()
    const { accessToken } = useToken()
    const navigate = useNavigate()
    const [songDetails, setSongDetails] = useState<SongType | undefined>(undefined)
    useEffect(() => {
        const getSongDetails = async () => {
            try {
                const request = await api.get(`/song/songs/${id}`)
                const song = request.data
                const songInfo = {
                    id: song.id,
                    title: song.title,
                    url: song.url,
                    isFavorite: song.isFavorite,
                    moods: song.moods
                }
                setSongDetails(songInfo)
            } catch (error) {
                throw new Error((error as any).message)
            }
        }
        getSongDetails()
    }, [accessToken])
    function getYouTubeID(youtubeUrl: string) {
        return new URLSearchParams(new URL(youtubeUrl).search).get("v");
    }
    const url = songDetails ? getYouTubeID(songDetails.url) : null
    if (!songDetails) return <div>Loading...</div>
    return (
        <div style={{
            height: "100vh",
            backgroundColor: "#0b0f19", // Clean dark background matching your app style
            color: "#f8fafc",
            overflow: "hidden",
            padding: "40px 72px",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Back Button Row */}
            <div>
                <Button
                    onClick={() => navigate(-1)}
                    // 🚀 Remove variant="ghost" to take full control of the styling
                    style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        padding: "8px 18px",
                        color: "#94a3b8", // Soft slate text
                        backgroundColor: "#1e293b", // Distinct darker blue/grey fill that pops from the main BG
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center"
                    }}
                    // Clean, subtle hover transition using standard inline events
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#334155"; // Brightens background slightly
                        e.currentTarget.style.color = "#f8fafc"; // Text shifts to clean crisp off-white
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#1e293b"; // Resets smoothly
                        e.currentTarget.style.color = "#94a3b8";
                    }}
                >
                    ← Back
                </Button>
            </div>

            {/* Main Content Split Grid */}
            <div style={{
                display: "flex",
                gap: "48px",
                marginTop: "32px",
                alignItems: "flex-start",
                height: "calc(100vh - 150px)", // Prevents page overflow
                width: "100%"
            }}>

                {/* Left Column: Video Container */}
                <div style={{
                    flex: "1 1 60%", // Takes up 60% of available width dynamically
                    maxWidth: "1200px",
                    aspectRatio: "16 / 9", // Forces perfect video proportions
                    position: "relative",
                    width: "100%"
                }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${url}`}
                        allowFullScreen
                        title={songDetails?.title || "Song Player"}
                        style={{
                            borderRadius: "24px",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                            position: "absolute",
                            top: 0,
                            left: 0
                        }}
                    />
                </div>

                {/* Right Column: Text & Tags metadata */}
                <div style={{
                    flex: "1 1 40%", // Takes remaining 40% width dynamically
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                    paddingTop: "12px"
                }}>
                    <h1 style={{
                        fontSize: "48px",
                        fontWeight: "800",
                        lineHeight: "1.15",
                        letterSpacing: "-0.02em",
                        color: "#ffffff"
                    }}>
                        {songDetails?.title}
                    </h1>

                    {/* Mood Badges Container */}
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px"
                    }}>
                        {songDetails?.moods.map((md: any) => (
                            <Badge
                                key={md.id}
                                variant="outline"
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    padding: "8px 16px",
                                    borderRadius: "9999px", // Pill-shaped style
                                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                                    color: "#cbd5e1",
                                    borderColor: "rgba(255, 255, 255, 0.1)"
                                }}
                            >
                                {md.name}
                            </Badge>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SongPage
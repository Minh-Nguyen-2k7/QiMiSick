import { Pencil, Play, Trash2 } from "lucide-react"
import type { AlbumType } from "./pages/AlbumPlayerPage"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import api from "../lib/axios"
interface AlbumProps extends AlbumType {
    onAlbumUpdate: () => void
}
const AlbumCard = ({ id, name, createdAt, songs, onAlbumUpdate }: AlbumProps) => {
    const navigate = useNavigate()
    const songsCount = songs.length
    const allMoods = songs.flatMap(song => song.moods);
    const uniqueMoods = Array.from(new Set(allMoods));
    const moodsCount = uniqueMoods.length;
    const time = new Date(createdAt).toLocaleDateString()
    const [isEditing, setIsEditing] = useState(false)
    const [editAlbumName, setEditAlbumName] = useState(name)
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select() // Select text for immediate quick overwriting
        }
    }, [isEditing])

    const handleSave = () => {
        const trimmed = editAlbumName.trim()
        if (trimmed && trimmed !== name) {
            onSaveName(id, trimmed)
        } else {
            setEditAlbumName(name) // Reset if empty
        }
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSave()
        } else if (e.key === "Escape") {
            setEditAlbumName(name) // Cancel edit on Escape press
            setIsEditing(false)
        }
    }
    const onSaveName = async (id: number, newName: string) => {
        try {
            await api.put(`/album/albums/${id}`,
                {
                    name: newName
                }
            )
            await onAlbumUpdate()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            }
            else {
                toast.error("Something went wrong.")
            }
        }
    }
    const handleDeleteAlbum = async (albumID: number) => {
        try {
            await api.delete(`/album/albums/${albumID}`)
            await onAlbumUpdate()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            }
            else {
                toast.error("Something went wrong.")
            }
        }
    }
    return (
        <Card className="relative w-full max-w-5xl bg-[#1e2230] border-slate-800/60 hover:border-slate-700/80 transition-all duration-200 overflow-hidden group shadow-md" style={{ boxShadow: "0 0 30px 12px rgba(168, 85, 247, 0.7)" }}>

            {/* Main Container Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 sm:gap-6">

                {/* Left Side: Identity and Metadata */}
                <div className="flex flex-col md:flex-row md:items-center flex-1 min-w-0 gap-4 md:gap-16">

                    {/* Dynamic Album Title View - FIXED TO HANDLE LONG STRINGS */}
                    <div className="flex-1 min-w-0 h-9 flex items-center">
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editAlbumName}
                                onChange={(e) => setEditAlbumName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleSave} // Automatically saves if user clicks away
                                className="w-full h-full bg-[#151821] text-white border border-purple-500/50 rounded px-3 py-1 text-xl font-bold tracking-tight focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                        ) : (
                            <h2
                                className="text-xl md:text-2xl font-bold tracking-tight text-white truncate"
                                title={name} // Shows full name on mouse hover
                            >
                                {name}
                            </h2>
                        )}
                    </div>

                    {/* Metadata Block (Song length & Mood tracking) */}
                    <div className="flex items-center gap-8 text-sm text-slate-300 flex-shrink-0">

                        {/* Song Count info */}
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className="font-semibold text-slate-200">{songsCount} Songs</span>
                        </div>

                        {/* Mood Information */}
                        <div className="text-slate-300 border-b border-dashed border-slate-600/60 pb-0.5 whitespace-nowrap font-medium">
                            {moodsCount} {moodsCount === 1 ? "Mood" : "Moods"}
                        </div>

                        {/* Time / Date Stamp */}
                        <div className="text-slate-400 border-b border-dashed border-slate-600/60 pb-0.5 whitespace-nowrap text-xs">
                            {time}
                        </div>
                    </div>
                </div>

                {/* Right Side: Action Control Layout */}
                <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                    {/* Edit Button */}
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="bg-[#2a2f42] text-slate-200 hover:bg-[#343a52] border border-slate-700/40 gap-2 h-9 px-4 font-medium transition"
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil className="w-3.5 h-3.5 text-slate-400" />
                        Edit Name
                    </Button>

                    {/* Trash Icon Button */}
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 h-9 w-9 p-0 flex items-center justify-center transition"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this album?")) {
                                handleDeleteAlbum(id);
                            }
                        }}
                        title="Delete Album"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Primary Action: Play Button */}
                    <Button
                        type="button"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950/20 gap-2 h-9 px-5 transition group-hover:scale-[1.02]"
                        onClick={() => navigate(`/player/${id}`)}
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Play
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default AlbumCard
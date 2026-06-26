import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { toast } from "sonner"
import { useToken } from "../context/TokenContext"
import { IoIosRemoveCircle } from "react-icons/io"
import api from "../../lib/axios"
import { generateMoodGradientStyleLight } from "../../lib/utils"
import type { SongType } from "./SongSection"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export interface MoodType {
    id: number,
    name: string
}

const MoodLibrary = () => {
    const [open, setOpen] = useState(false)
    const [moodName, setMoodName] = useState("")
    const [allMoods, setAllMoods] = useState<MoodType[]>([])
    const { accessToken } = useToken()
    const [deleteMoods, setDeleteMoods] = useState(false)
    const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
    const [linkedSongs, setLinkedSongs] = useState<SongType[]>([])

    const fetchLinkedSongs = async (moodID: number) => {
        if (!selectedMood) return
        try {
            const request = await api.get(`http://localhost:8080/mood/moods/${moodID}`)
            const songs: SongType[] = request.data.songs
            setLinkedSongs(songs)
        } catch (error) {
            console.error("Failed to load connected songs:", error)
        }
    }
    useEffect(() => {
        if (selectedMood) {
            fetchLinkedSongs(selectedMood.id);
        } else {
            setLinkedSongs([]); // Clear out cache cleanly when returning to the full palette grid
        }
    }, [selectedMood]);
    const getYoutubeThumbnail = (url: string) => {
        const youtubeID = new URLSearchParams(new URL(url).search).get("v")
        const thumbnail = "https://img.youtube.com/vi/" + youtubeID + "/maxresdefault.jpg"
        return thumbnail
    }
    const fetchAllMoods = async () => {
        try {
            const request = await api.get("http://localhost:8080/mood/moods")
            const moods: MoodType[] = request.data
            const newMoods = moods.map((mood) => ({
                id: mood.id,
                name: mood.name
            }));
            setAllMoods(newMoods)
        } catch (error) {
            console.error("Failed to load mood index context parameters:", error)
        }
    }

    useEffect(() => {
        if (accessToken) {
            fetchAllMoods()
        }
    }, [accessToken])

    const handleSubmit = async () => {
        if (!moodName.trim()) return toast.error("Mood can't be an empty string")
        try {
            await api.post("http://localhost:8080/mood/newMood", {
                name: moodName
            })
            toast.success("Mood successfully added!")
            fetchAllMoods()
            setOpen(false)
            setMoodName("")
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            } else {
                toast.error("Something went wrong.")
            }
        }
    }

    const removeMood = async (id: number) => {
        try {
            await api.delete(`http://localhost:8080/mood/moods/${id}`)
            toast.success("Mood removed.")
            fetchAllMoods()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            } else {
                toast.error("Something went wrong.")
            }
        }
    }

    return (
        <div className="w-full min-h-screen text-slate-800 p-8 bg-[#0f111a]">
            {/* Top Command Bar */}
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-5">
                <div>
                    <Link
                        to="/library"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Library
                    </Link>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded shadow-sm border-none transition-colors duration-150">
                            + Add Mood
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Add Mood Name</DialogTitle>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="moodName">Mood Name</Label>
                                <Input
                                    id="moodName"
                                    name="moodName"
                                    value={moodName}
                                    placeholder="Ex: catchy, lofi, upbeat, etc..."
                                    onChange={(e) => setMoodName(e.target.value)}
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="button" onClick={handleSubmit}>Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Mood Button */}
                <Button
                    onClick={() => setDeleteMoods(!deleteMoods)}
                    variant="outline"
                    className={`px-4 py-2 font-medium text-sm rounded transition-all duration-150 ${deleteMoods
                        ? "bg-rose-950/40 border-rose-800 text-rose-400 hover:bg-rose-950/60"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:text-rose-400 hover:border-rose-900/50"
                        }`}
                >
                    {deleteMoods ? "Done Editing" : "Delete Mood"}
                </Button>
            </div>

            {/* Main Workspace Render Track */}
            {!selectedMood ? (
                allMoods.length === 0 ? (
                    /*Edge case: User have no mood */
                    <div className="flex flex-col items-center justify-center min-h-[350px] border border-dashed border-slate-800/80 rounded-2xl p-8 text-center bg-[#151821]/20 backdrop-blur-sm max-w-4xl mx-auto animate-fade-in">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                            <span className="text-xl">✨</span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-200 mb-1">No Mood Filters Found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mb-5">
                            Use "Add Mood" button to add your own custom mood name.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allMoods.map((mood) => {
                            const cardTheme = generateMoodGradientStyleLight(mood.name);

                            return (
                                <div
                                    key={mood.id}
                                    onClick={() => { if (!deleteMoods) setSelectedMood(mood); }}
                                    style={{
                                        background: cardTheme.backgroundActual,
                                        borderColor: cardTheme.borderColor
                                    }}
                                    className="group relative h-40 rounded-xl border p-6 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:brightness-110 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] will-change-transform"
                                >
                                    <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.08] transition-colors duration-200" />
                                    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold tracking-wide text-white drop-shadow-sm">
                                            {mood.name}
                                        </h3>
                                        <p className="text-xs text-white/60 mt-1 font-medium">Collection filter</p>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between w-full">
                                        <span className="text-[10px] font-mono font-semibold tracking-wider text-white/50 group-hover:text-white transition-colors">
                                            EXPLORE SONGS →
                                        </span>
                                    </div>

                                    {deleteMoods && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeMood(mood.id);
                                            }}
                                            className="absolute top-4 right-4 z-20 p-1 bg-slate-950/80 text-red-400 hover:text-red-500 rounded-full border border-slate-800 transition-colors"
                                        >
                                            <IoIosRemoveCircle className="text-xl" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                /* INSIDE OF A MOOD */
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800/60 pb-4">
                        <div>
                            <button
                                onClick={() => setSelectedMood(null)}
                                className="text-xs text-slate-400 hover:text-white mb-3 flex items-center gap-2 font-mono tracking-wide bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800 transition-all duration-150"
                            >
                                ← BACK TO PALETTE
                            </button>
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                Vibe Focus: <span className="text-blue-400">{selectedMood.name}</span>
                            </h2>
                        </div>
                    </div>

                    {linkedSongs.length > 0 ? (
                        <div className="flex flex-col gap-1.5 max-w-6xl w-full">
                            {/* Table Core Definition Label Headers */}
                            <div className="flex items-center text-[11px] font-mono uppercase tracking-wider text-slate-500 px-4 py-2 border-b border-slate-800/40 select-none">
                                <div className="w-10 text-center">#</div>
                                <div className="flex-1">Track Information</div>
                                <div className="w-48 hidden md:block">Connected Mood Tags</div>
                                <div className="w-28 text-right">Action</div>
                            </div>

                            {/* List Row Output Mapping Loop */}
                            {linkedSongs.map((song, index) => {
                                const thumbnailUrl = getYoutubeThumbnail(song.url);
                                return (
                                    <div
                                        key={song.id}
                                        className="group flex items-center gap-4 p-2.5 rounded-lg bg-slate-900/20 hover:bg-slate-800/30 border border-transparent hover:border-slate-800/60 transition-all duration-150"
                                    >
                                        <div className="w-10 flex items-center justify-center font-mono text-xs text-slate-500 group-hover:text-emerald-400">
                                            <span className="group-hover:hidden">{index + 1}</span>
                                            <svg className="w-3.5 h-3.5 hidden group-hover:block fill-current" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>

                                        <div className="flex-1 flex items-center gap-3 min-w-0">
                                            <img
                                                src={thumbnailUrl}
                                                alt="Video Track Cover"
                                                className="w-11 h-11 rounded object-cover shadow border border-slate-800/80 bg-slate-950"
                                            />
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                                                    {song.title}
                                                </h4>
                                                <span className="text-[10px] font-mono text-slate-500 truncate block mt-0.5 max-w-xs group-hover:text-slate-400">
                                                    {song.url.substring(0, 45)}...
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-48 hidden md:flex flex-wrap gap-1.5">
                                            {song.moods?.slice(0, 2).map((m) => (
                                                <span
                                                    key={m.id}
                                                    className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800/60 px-2 py-0.5 rounded-md font-medium tracking-wide"
                                                >
                                                    {m.name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="w-28 text-right">
                                            <a
                                                href={song.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center px-3 py-1 bg-slate-900 hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 text-xs font-semibold rounded border border-slate-800 hover:border-emerald-800/60 shadow-sm transition-all duration-150"
                                            >
                                                Play Song
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Edge case: No tracks attached to the mood */
                        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-slate-800 bg-[#151821]/10 text-center max-w-6xl w-full p-6">
                            <div className="w-10 h-10 bg-slate-800/40 rounded-xl flex items-center justify-center text-slate-400 mb-3 border border-slate-800/60">
                                <span className="text-sm">🎵</span>
                            </div>
                            <h4 className="text-sm font-medium text-slate-300">No Tracks Linked</h4>
                            <p className="text-xs text-slate-500 max-w-xs mt-1">
                                No tracks attached to this mood.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MoodLibrary
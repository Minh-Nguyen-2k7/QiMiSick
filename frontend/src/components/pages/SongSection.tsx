import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import SongCard from "../SongCard"
import type { MoodType } from "./MoodSection"
import api from "../../lib/axios"
import PaginationPage from "../PaginationPage"
import { fetchAllSongsFromPlaylist, filterDuplicateSongs, getPlaylistIdFromUrl } from "../tools/extractSongAlbum"
import { useFilter } from "../context/FilterContext"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
export interface SongType {
    id: number,
    title: string,
    url: string,
    isFavorite: boolean
    moods: MoodType[]
}
const SongLibrary = () => {
    const [openMain, setOpenMain] = useState(false)
    const [openSide, setOpenSide] = useState(false)
    const [ytbUrl, setYtbURl] = useState("")
    const [allSongs, setAllSongs] = useState<SongType[]>([])
    const { accessToken } = useToken()
    const fetchAllSongs = async () => {
        try {
            const request = await api.get("/song/songs")
            const songs: SongType[] = request.data
            const newSongs = songs.map((song) => ({
                id: song.id,
                title: song.title,
                url: song.url,
                isFavorite: song.isFavorite,
                moods: song.moods
            }));
            setAllSongs(newSongs)
        } catch (error) {
            throw new Error((error as any).message)
        }
    }
    const [deleteSongFilter, setDeleteSongFilter] = useState(false)
    useEffect(() => {
        try {
            fetchAllSongs()
        } catch (error) {
            throw new Error((error as any).message)
        }
    }, [accessToken])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleSubmitMain = async () => {
        if (isSubmitting) return; // guard against double clicks
        setIsSubmitting(true);
        const playlistID = getPlaylistIdFromUrl(ytbUrl)
        if (playlistID) {
            setOpenMain(false)
            setOpenSide(true)
        }
        else {
            try {
                const response = await api.post("/fetch/ytb_title",
                    { url: ytbUrl })
                const title = response.data.title
                await api.post("/song/newSong",
                    {
                        title: title,
                        url: ytbUrl
                    }
                )
                toast.success("Song successfully added!")
                fetchAllSongs()
                setOpenMain(false)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.error(error.response.data)
                }
                else {
                    toast.error("Something went wrong.")
                }
            } finally {
                setIsSubmitting(false)
            }
        }
    }
    const handleSubmitOneSong = async () => {
        try {
            const response = await api.post("/fetch/ytb_title",
                { url: ytbUrl })
            const title = response.data.title
            await api.post("/song/newSong",
                {
                    title: title,
                    url: ytbUrl
                }
            )
            toast.success("Song successfully added!")
            fetchAllSongs()
            setOpenMain(false)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            }
            else {
                toast.error("Something went wrong.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }
    const [isProcessing, setIsProcessing] = useState(false);
    const handleSubmitTracks = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        // 1. Fire a standard informative toast indicating the process has started
        toast.info("Importing tracks... Please wait while we process the album.");

        try {
            const playlistID = getPlaylistIdFromUrl(ytbUrl);
            if (!playlistID) {
                throw new Error("This is not a playlist");
            }

            const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
            if (!apiKey) {
                console.error("YOUTUBE_API_KEY is missing from your .env configuration.");
                toast.error("Configuration error: Missing API key.");
                return;
            }

            const trackURLs = await fetchAllSongsFromPlaylist(playlistID, apiKey);
            const uniqueTrackURLs = filterDuplicateSongs(allSongs, trackURLs);

            if (uniqueTrackURLs.length === 0) {
                toast.info("All songs in this album are already in your library!");
                return;
            }

            // Loop through and sync individual tracks
            for (const ytbUrl of uniqueTrackURLs) {
                const response = await api.post("/fetch/ytb_title", { url: ytbUrl });
                const title = response.data.title;
                await api.post("/song/newSong", {
                    title: title,
                    url: ytbUrl
                });
            }

            console.log(`Successfully batch added ${uniqueTrackURLs.length} tracks.`);
            fetchAllSongs();

            // 2. Fire your standard success toast at the end
            toast.success(`Successfully added ${uniqueTrackURLs.length} tracks!`);

        } catch (error: any) {
            console.error("Routing error adding track(s):", error);

            let errorMessage = "Failed to fetch tracks from this playlist.";
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            // 3. Fire your standard error toast
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };
    const [musicsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1)
    const totalSongs = allSongs.length
    const lastSongIndex = musicsPerPage * currentPage
    const firstSongIndex = lastSongIndex - musicsPerPage
    const currentMusics = allSongs.slice(firstSongIndex, lastSongIndex)

    const { searchQuery, setSearchQuery } = useFilter()
    const getFilteredSongs = () => {
        let filteredSongs = allSongs
        if (searchQuery) {
            filteredSongs = filteredSongs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        return filteredSongs
    }
    const filteredSongs = getFilteredSongs()
    const totalFilteredSongs = filteredSongs.length
    const currentFilteredMusics = filteredSongs.slice(firstSongIndex, lastSongIndex)
    return (
        <div>
            {/* Dialog for many tracks*/}
            {openSide &&
                <Dialog open={openSide} onOpenChange={setOpenSide}>
                    <DialogContent className="sm:max-w-[360px] p-6 gap-6">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-semibold tracking-tight">
                                You've sent us an album!
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground">
                                Would you like to fetch all songs in your albums at once?
                            </p>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto min-w-[70px] bg-white border-slate-300 text-slate-900 shadow-sm hover:bg-slate-50"
                                onClick={() => {
                                    setOpenSide(false)
                                    handleSubmitOneSong()
                                }}
                            >
                                No
                            </Button>
                            <Button
                                type="button"
                                variant="default"
                                className="w-full sm:w-auto min-w-[70px]"
                                onClick={() => {
                                    setOpenSide(false)
                                    handleSubmitTracks()
                                }}
                            >
                                Yes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
            <div className="mb-4">
                <Link
                    to="/library"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Library
                </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-2 max-w-7xl">
                {/* Light-Theme Optimized Search Input Frame */}
                <div className="relative w-full max-w-md group">
                    {/* Loupe Icon */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-150">
                        <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>

                    {/* Clean Light Input Shell */}
                    <input
                        type="text"
                        placeholder="Search tracks by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-300 focus:outline-none transition-all duration-150 shadow-sm"
                    />

                    {/* Clear Filter Button */}
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    )}
                </div>
                {/* Action Control Group Line */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Main Dialog*/}
                    <Dialog open={openMain} onOpenChange={setOpenMain}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="font-bold">Add Song</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Add Song Here</DialogTitle>
                                <DialogDescription>
                                    Just give the Youtube URL. We'll get the job done.
                                </DialogDescription>
                            </DialogHeader>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="songURL">Song URL (Youtube)</Label>
                                    <Input id="songURL" name="songURL" placeholder="https://www.youtube.com/watch?v=abcxyz" onChange={(e) => setYtbURl(e.target.value)} />
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpenMain(false)}>Cancel</Button>
                                <Button type="button" onClick={handleSubmitMain}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button
                        onClick={() => setDeleteSongFilter(!deleteSongFilter)}
                        variant="outline"
                        className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all duration-150 ${deleteSongFilter
                            ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                            : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                            }`}
                    >
                        {deleteSongFilter ? "Done Editing" : "Delete Song"}
                    </Button>
                </div>
            </div>

            {/* 📋 MUSIC TRACK DISPLAY RESULTS GRID AREA */}
            {!searchQuery ? (
                currentMusics.length === 0 ? (
                    /* 🚀 EDGE CASE: Total System Song Vault is 0 */
                    <div className="flex flex-col items-center justify-center min-h-[350px] border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 animate-fade-in max-w-7xl">
                        <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20">
                            <span className="text-xl">🎵</span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 mb-1">No Tracks Found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mb-5">
                            Your personal song inventory is completely empty. Use "Add Song" to get your songs stored.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            {currentMusics.map(({ id, title, url, isFavorite, moods }) => (
                                <SongCard
                                    key={id}
                                    id={id}
                                    title={title}
                                    url={url}
                                    isFavorite={isFavorite}
                                    moods={moods}
                                    onMoodUpdate={() => fetchAllSongs()}
                                    deleteFilter={deleteSongFilter}
                                    onSongUpdate={() => fetchAllSongs()}
                                />
                            ))}
                        </div>
                        <PaginationPage totalSongs={totalSongs} songsPerPage={musicsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </div>
                )
            ) : (
                currentFilteredMusics.length === 0 ? (
                    /* 🚀 EDGE CASE: Filter active but returns 0 hits */
                    <div className="flex flex-col items-center justify-center min-h-[350px] border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 animate-fade-in max-w-7xl">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
                            <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 mb-1">No Match Found</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                            We couldn't find anything in your library matching <span className="font-semibold text-slate-700">"{searchQuery}"</span>. Try adjusting your query keywords.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            {currentFilteredMusics.map(({ id, title, url, isFavorite, moods }) => (
                                <SongCard
                                    key={id}
                                    id={id}
                                    title={title}
                                    url={url}
                                    isFavorite={isFavorite}
                                    moods={moods}
                                    onMoodUpdate={() => fetchAllSongs()}
                                    deleteFilter={deleteSongFilter}
                                    onSongUpdate={() => fetchAllSongs()}
                                />
                            ))}
                        </div>
                        <PaginationPage totalSongs={totalFilteredSongs} songsPerPage={musicsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </div>
                )
            )}
        </div>
    )
}

export default SongLibrary


import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import type { MoodType } from "./MoodSection"
import { useToken } from "../context/TokenContext"
import axios from "axios"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import type { SongType } from "./SongSection"
import { toast } from "sonner"
import SelectionCard from "../SelectionCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import api from "../../lib/axios"
import PaginationPage from "../PaginationPage"
import { useFilter } from "../context/FilterContext"


const MusicSelectionPage = () => {
    const navigate = useNavigate()
    const { accessToken } = useToken()
    const [allMoods, setAllMoods] = useState<MoodType[]>([])
    const fetchAllMoods = async () => {
        try {
            const request = await api.get("/mood/moods")
            const moods: MoodType[] = request.data
            const newMoods = moods.map((mood) => ({
                id: mood.id,
                name: mood.name
            }));
            setAllMoods(newMoods)
        } catch (error) {
            throw new Error((error as any).message)
        }
    }
    const [allSongs, setAllSongs] = useState<SongType[]>([])
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
    const [open, setOpen] = useState(false)
    const [albumName, setAlbumName] = useState("")
    const connectAlbum = async (albumID: number | undefined) => {
        if (selectedSongs.length === 0) {
            toast.error("Please select at least a song")
            return false
        }
        const requests = selectedSongs.map(songID => api.put(`/album/albums/${albumID}/songs/${songID}`, {}))
        await Promise.all(requests)
        return true
    }
    const [listenToCreatedAlbum, setListenToCreatedAlbum] = useState(false)
    const createNewAlbum = async () => {
        if (!albumName) {
            return toast.error("Please name your album")
        }
        let albumID: number | undefined
        try {
            const response = await api.post("/album/newAlbum",
                {
                    name: albumName
                }
            )
            albumID = response.data.id
            const success = await connectAlbum(albumID)
            if (!success) return
            setListenToCreatedAlbum(true)
            setSelectedSongs([])
            setSelectedMoods([])
            setOpen(false)
        } catch (error) {
            if (albumID) {
                try {
                    await api.delete(`/album/albums/${albumID}`)
                } catch (error) {
                    console.error("Failed to clean up orphaned album:", error)
                }
            }
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            }
            else {
                toast.error("Album was not created.")
            }
        }
    }
    useEffect(() => {
        try {
            fetchAllMoods()
            fetchAllSongs()
        } catch (error) {
            throw new Error((error as any).message)
        }
    }, [accessToken])
    const [selectedSongs, setSelectedSongs] = useState<number[]>([])
    const [selectedMoods, setSelectedMoods] = useState<number[]>([])
    useEffect(() => {
        const matchingSongs = allSongs.filter(song =>
            song.moods.some((m: any) => selectedMoods.includes(m.id))
        )
        const matchingIDs = matchingSongs.map(s => s.id)
        setSelectedSongs(prev => [...new Set([...prev, ...matchingIDs])])
    }, [selectedMoods])
    // --- 1. PAGINATION & NAVIGATION STATE ---
    const [musicsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1)
    const [activeTab, setActiveTab] = useState("all")
    const { searchQuery, setSearchQuery } = useFilter()

    const lastSongIndex = musicsPerPage * currentPage
    const firstSongIndex = lastSongIndex - musicsPerPage

    // --- 2. DYNAMIC TAB & TEXT FILTERING ENGINE ---
    // Pull base tracks matching the current visual workspace perspective
    const getBaseTabSongs = () => {
        switch (activeTab) {
            case "selected": return allSongs.filter(s => selectedSongs.includes(s.id));
            case "unselected": return allSongs.filter(s => !selectedSongs.includes(s.id));
            case "favorites": return allSongs.filter(s => s.isFavorite);
            case "all":
            default: return allSongs;
        }
    };

    // Layer search keywords over the subset smoothly
    const tabSongsFilteredBySearch = getBaseTabSongs().filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Derivations for layout limits and pagination slices
    const totalSongsForCurrentView = tabSongsFilteredBySearch.length
    const currentMusicsToDisplay = tabSongsFilteredBySearch.slice(firstSongIndex, lastSongIndex)

    // --- 3. BOUNDARY GUARD EFFECT ---
    useEffect(() => {
        const maxPage = Math.ceil(totalSongsForCurrentView / musicsPerPage) || 1;

        // Safely snap out-of-bounds page positions back to validity
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [totalSongsForCurrentView, musicsPerPage]);
    return (
        <div>
            <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                setCurrentPage(1); // Cleanly reset back to page 1 whenever switching filters
            }}>
                <TabsList variant="line">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="selected">Selected</TabsTrigger>
                    <TabsTrigger value="unselected">Unselected</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                <div className="flex flex-col gap-4 w-full max-w-7xl">
                    {/* 1. Control Bar: Perfectly centered horizontally */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        {/* Search Field Container */}
                        <div className="relative w-full max-w-md group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-150">
                                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Filter current tab tracks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-300 focus:outline-none transition-all duration-150 shadow-sm"
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

                        {/* Global Configuration Buttons Side-by-Side (Aligned to input center) */}
                        <div className="flex items-center gap-2 self-end sm:self-auto h-full">
                            <Button
                                onClick={() => {
                                    setSelectedSongs([])
                                    setSelectedMoods([])
                                }}
                                variant="outline"
                                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 border-slate-200 hover:bg-rose-50 rounded-lg shadow-sm transition-all"
                            >
                                Reset All
                            </Button>
                            <Button
                                onClick={() => setSelectedMoods(allMoods.map(mood => mood.id))}
                                variant="outline"
                                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-200 bg-white rounded-lg shadow-sm transition-all"
                            >
                                Select All Moods
                            </Button>
                            <Button
                                onClick={() => setSelectedSongs(allSongs.map(song => song.id))}
                                variant="outline"
                                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-200 bg-white rounded-lg shadow-sm transition-all"
                            >
                                Select All Songs
                            </Button>
                            {/* ⚡ Cleanly integrated Create Album Dialog into the control strip */}
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className="px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-all border-none">
                                        Create Album
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>Add Album Name</DialogTitle>
                                    </DialogHeader>
                                    <FieldGroup>
                                        <Field>
                                            <Label htmlFor="albumName">Album Name</Label>
                                            <Input
                                                id="albumName"
                                                name="albumName"
                                                placeholder="Enter album name..."
                                                onChange={(e) => setAlbumName(e.target.value)}
                                            />
                                        </Field>
                                    </FieldGroup>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                        <Button type="button" onClick={() => createNewAlbum()}>Add</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* 2. Mood Interactive Tag Container */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {allMoods.map((mood) => {
                            const isSelected = selectedMoods.includes(mood.id);
                            return (
                                <Badge
                                    key={mood.id}
                                    variant="outline"
                                    onClick={() => setSelectedMoods(prev =>
                                        prev.includes(mood.id)
                                            ? prev.filter(p => p !== mood.id)
                                            : [...prev, mood.id]
                                    )}
                                    className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-150 ${isSelected
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-sm"
                                        : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/60"
                                        }`}
                                >
                                    {mood.name}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                {/* One universal layout container handles all tab views seamlessly */}
                <TabsContent value={activeTab}>
                    {currentMusicsToDisplay.length > 0 ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                {currentMusicsToDisplay.map(({ id, title, url, isFavorite, moods }) => (
                                    <SelectionCard
                                        key={id}
                                        id={id}
                                        title={title}
                                        url={url}
                                        isFavorite={isFavorite}
                                        moods={moods}
                                        isSelected={selectedSongs.includes(id)}
                                        onClick={() => setSelectedSongs(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])}
                                    />
                                ))}
                            </div>

                            {/* ⚡ Dynamic totals feed into the pagination perfectly */}
                            <PaginationPage
                                totalSongs={totalSongsForCurrentView}
                                songsPerPage={musicsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    ) : allSongs.length === 0 ? (
                        /* 🚀 EDGE CASE 1: The entire track inventory is empty */
                        <div className="flex flex-col items-center justify-center min-h-[320px] border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 max-w-7xl mt-4 animate-fade-in">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-3 border border-indigo-500/20">
                                <span className="text-lg">💿</span>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-800 mb-1">Your Song Inventory Is Empty</h3>
                            <p className="text-xs text-slate-500 max-w-sm">
                                No songs exist in your library database yet. Please add at least song first.
                            </p>
                        </div>
                    ) : (
                        /* 🚀 EDGE CASE 2: Tracks exist but are completely filtered out */
                        <div className="flex flex-col items-center justify-center min-h-[320px] border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 max-w-7xl mt-4 animate-fade-in">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
                                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-800 mb-1">No Filtering Matches</h3>
                            <p className="text-xs text-slate-500 max-w-sm">
                                We couldn't find anything in your library matching <span className="font-semibold text-slate-700">"{searchQuery}"</span>. Try adjusting your query keywords.
                            </p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            {listenToCreatedAlbum &&
                <Dialog open={listenToCreatedAlbum} onOpenChange={setListenToCreatedAlbum}>
                    <DialogContent className="sm:max-w-[360px] p-6 gap-6">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-semibold tracking-tight">
                                Album created!
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground">
                                Would you like to listen to your new album right now?
                            </p>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto min-w-[70px] bg-white border-slate-300 text-slate-900 shadow-sm hover:bg-slate-50"
                                onClick={() => setListenToCreatedAlbum(false)}
                            >
                                No
                            </Button>
                            <Button
                                type="button"
                                variant="default"
                                className="w-full sm:w-auto min-w-[70px]"
                                onClick={() => navigate("/app/player")}
                            >
                                Yes, listen
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        </div>
    )
}

export default MusicSelectionPage


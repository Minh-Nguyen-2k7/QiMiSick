import { useNavigate, useParams } from "react-router-dom"
import { useToken } from "./context/TokenContext"
import { Button } from "./ui/button"
import { Fragment, useEffect, useState, useRef } from "react"
import type { SongType } from "./pages/SongSection"
import type { AlbumType } from "./pages/AlbumPlayerPage"
import ReactPlayer from 'react-player'
import { FaBackwardStep, FaForwardStep, FaPause, FaPlay } from "react-icons/fa6"
import AlbumSongCard from "./AlbumSongCard"
import api from "../lib/axios"
import { ScrollArea } from "./ui/scroll-area"
import { AudioAnalyzer, useAudio } from "./context/AudioContext"
import { Slider } from "./ui/slider"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger
} from "./ui/select"
import { MdFullscreen, MdSubtitles } from "react-icons/md"

const AlbumPlayer = () => {
    const { isPlaying, togglePlay, playAlbum, currentTrack, currentTrackIndex, setIsPlaying } = useAudio()
    const { id } = useParams()
    const { accessToken } = useToken()
    const navigate = useNavigate()
    const [songs, setSongs] = useState<SongType[]>([])
    const [volume, setVolume] = useState<number>(50) // Default to 50%
    const [playbackRate, setPlaybackRate] = useState<number>(1.0)
    const [albumName, setAlbumName] = useState("YOUR ALBUM PLAYLIST")
    const getAlbum = async () => {
        try {
            const request = await api.get(`http://localhost:8080/album/albums/${id}`)
            const album: AlbumType = request.data
            setSongs(album.songs)
            setAlbumName(album.name)
            if (album.songs.length > 0) {
                playAlbum(album.songs, currentTrackIndex >= 0 ? currentTrackIndex : 0)
            }
        } catch (error) {
            throw new Error((error as any).message)
        }
    }

    useEffect(() => {
        getAlbum()
    }, [accessToken, id])

    const handleNextSong = () => {
        if (songs.length === 0) return
        const activeIdx = currentTrackIndex >= 0 ? currentTrackIndex : 0
        const nextIdx = (activeIdx + 1) % songs.length
        playAlbum(songs, nextIdx)
    }

    const handleBackSong = () => {
        if (songs.length === 0) return
        const activeIdx = currentTrackIndex >= 0 ? currentTrackIndex : 0
        const prevIdx = (activeIdx - 1 + songs.length) % songs.length
        playAlbum(songs, prevIdx)
    }


    function getYouTubeID(youtubeUrl: string) {
        try {
            return new URLSearchParams(new URL(youtubeUrl).search).get("v")
        } catch (e) {
            return null
        }
    }

    const currentSong = currentTrack || songs[0]
    const currentVideoUrl = currentSong ? currentSong.url : null
    const youtubeUrl = currentVideoUrl ? getYouTubeID(currentVideoUrl) : null
    const thumbnail = youtubeUrl ? `https://img.youtube.com/vi/${youtubeUrl}/maxresdefault.jpg` : null

    useEffect(() => {
        if (!isPlaying) return

        // Create a background worker thread on the fly via Blob
        const blob = new Blob([
            `setInterval(() => { postMessage('tick') }, 1000)`
        ], { type: "text/javascript" })

        const worker = new Worker(URL.createObjectURL(blob))

        // This listener runs on a bulletproof background thread
        worker.onmessage = () => {
            if (document.hidden) {
                // Check if the current native video element inside the DOM has finished
                const videoEl = document.querySelector('video')
                if (videoEl && videoEl.ended) {
                    console.log("Background thread detected video completion. Advancing.")
                    handleNextSong()
                }
            }
        }

        return () => worker.terminate()
    }, [isPlaying, currentVideoUrl])
    useEffect(() => {
        // Whenever the active track shifts, reset the state back to normal speed
        setPlaybackRate(1.0)
    }, [currentTrackIndex]) // 👈 Replace with your track object/ID variable name

    const playerRef = useRef<HTMLVideoElement | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    // Calculate percentage for the slider fill
    const progressPercentage = duration > 0
        ? Math.min(Math.max((currentTime / duration) * 100, 0), 100)
        : 0
    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "0:00"
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = Math.floor(timeInSeconds % 60)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    // 1. Create a ref for the container element you want to make fullscreen
    const playerContainerRef = useRef<HTMLDivElement>(null)

    const handleToggleFullscreen = () => {
        if (!playerContainerRef.current) return

        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`)
            })
        } else {
            document.exitFullscreen()
        }
    }
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(false) // FIXME: ALLOW SUBTITLES TO BE TURN ON AND OFF
    const handleSubtitleToggle = () => { // FIXME: ALLOW SUBTITLES TO BE TURN ON AND OFF
        setSubtitlesEnabled((prev) => !prev) // FIXME: ALLOW SUBTITLES TO BE TURN ON AND OFF
    } // FIXME: ALLOW SUBTITLES TO BE TURN ON AND OFF

    if (songs.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen text-sky-400">
                Loading album tracks...
            </div>
        )
    }

    return (
        <div className="w-full h-screen bg-[#0f111a] p-4 relative overflow-hidden flex items-center justify-center">
            {currentVideoUrl && (
                <AudioAnalyzer isPlaying={isPlaying} />
            )}

            <div
                id="dynamic-audio-bg"
                className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen transition-all duration-300 ease-out will-change-transform"
            >
                <div
                    className="absolute inset-0 transition-all duration-[1500ms] ease-in-out blur-[130px]"
                    style={{
                        background: isPlaying
                            ? 'radial-gradient(circle at center, rgba(147, 51, 234, 0.35) 0%, rgba(15, 17, 26, 1) 80%)'
                            : 'radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, rgba(15, 17, 26, 1) 100%)'
                    }}
                />
                {isPlaying && (
                    <div className="absolute inset-x-[15%] inset-y-[20%] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-[140px] mix-blend-overlay animate-pulse duration-[3000ms]" />
                )}
            </div>

            <div className="w-full h-[calc(100vh-2rem)] p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 flex flex-col h-full gap-4">

                    {/* RECTANGLE 1: The Big Media Area */}
                    <div ref={playerContainerRef} className="relative flex-1 bg-[#1e2230] border border-slate-800 rounded-xl shadow-lg h-96 overflow-hidden">
                        {currentVideoUrl && (
                            <ReactPlayer
                                ref={playerRef}
                                src={currentVideoUrl}
                                className="absolute top-0 left-0 w-full h-full"
                                width="100%"
                                height="100%"
                                controls={false}
                                volume={volume / 100}
                                playbackRate={playbackRate}
                                playing={isPlaying}
                                onEnded={handleNextSong}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onDurationChange={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                                    setDuration(e.currentTarget.duration || 0)
                                }}
                                onTimeUpdate={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                                    setCurrentTime(e.currentTarget.currentTime || 0)
                                }}
                                config={{
                                    youtube: {
                                        // Initial load setting only
                                        cc_load_policy: 0, // FIXME: ALLOW SUBTITLES TO BE TURN ON AND OFF
                                        hl: 'en'
                                    }
                                }}
                            />
                        )}
                    </div>

                    {/* RECTANGLE 2: Asymmetric Control Bar */}
                    <div className="w-full min-h-24 py-1.5 bg-[#151821] border border-slate-800/80 rounded-xl grid grid-cols-[1.2fr_1fr_1.2fr] items-center px-6">

                        {/* 👈 Expanded Left Column: Track Details */}
                        <div className="flex items-center gap-4 min-w-0 pr-2">
                            {/* Slightly larger thumbnail bounding box for clean presentation */}
                            <div className="w-14 h-14 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden border border-slate-700/50 shadow-md">
                                {thumbnail ? (
                                    <img src={thumbnail} alt="Track thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                        <span className="text-xs text-slate-500 font-bold uppercase">Mv</span>
                                    </div>
                                )}
                            </div>

                            {/* Expanded Info Typography Block */}
                            <div className="min-w-0 flex flex-col">
                                <span className="text-sm font-semibold text-slate-200 truncate tracking-wide" title={currentSong?.title}>
                                    {currentSong?.title || "No Track Selected"}
                                </span>
                                <span className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                                    YouTube Track
                                </span>
                            </div>
                        </div>

                        {/* 🎯 Center Column Container: Timeline Track & Controls */}
                        <div className="flex flex-col items-center justify-center gap-3 w-full px-4">
                            <div className="flex items-center justify-center gap-4 w-full">
                                <FaBackwardStep
                                    className="text-sky-400 hover:text-sky-300 w-6 h-6 cursor-pointer transition-all active:scale-90"
                                    onClick={handleBackSong}
                                />
                                <button
                                    onClick={() => {
                                        if (currentTrackIndex === -1) {
                                            playAlbum(songs, 0)
                                        } else {
                                            togglePlay()
                                        }
                                    }}
                                    style={{
                                        boxShadow: isPlaying
                                            ? "0 0 35px 10px rgba(168, 85, 247, 0.75), inset 0 0 12px 2px rgba(168, 85, 247, 0.3)"
                                            : "0 0 20px 2px rgba(168, 85, 247, 0.25)"
                                    }}
                                    className={`w-16 h-16 rounded-full bg-transparent border-2 ${isPlaying ? 'border-sky-400 text-sky-400' : 'border-sky-500/60 text-sky-500/80'} flex items-center justify-center transition-all duration-300 transform active:scale-90 relative group`}
                                >
                                    <div className="absolute inset-0 rounded-full bg-sky-500/5 opacity-100 group-hover:bg-sky-500/10 transition-all" />
                                    {isPlaying ? <FaPause className="w-5 h-5 relative z-10" /> : <FaPlay className="w-5 h-5 ml-0.5 relative z-10" />}
                                </button>

                                <FaForwardStep
                                    className="text-sky-400 hover:text-sky-300 w-6 h-6 cursor-pointer transition-all active:scale-90"
                                    onClick={handleNextSong}
                                />
                            </div>

                            <div className="flex flex-col w-full gap-1 px-1">
                                {/* The Timeline Track Container */}
                                <div
                                    className="relative w-full h-1 hover:h-1.5 bg-slate-800 rounded-full cursor-pointer group transition-all duration-150"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        const clickX = e.clientX - rect.left
                                        const newTime = (clickX / rect.width) * duration
                                        if (playerRef.current) {
                                            playerRef.current.currentTime = newTime
                                            setCurrentTime(newTime)
                                        }
                                    }}
                                >
                                    {/* Active Progress Fill */}
                                    <div
                                        className="absolute top-0 left-0 h-full bg-cyan-400 rounded-full group-hover:bg-cyan-300 transition-colors"
                                        style={{ width: `${progressPercentage}%` }}
                                    />

                                    {/* Tiny Glow Thumb Pointer (Visible on Hover) */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 size-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_#22d3ee] transition-opacity pointer-events-none"
                                        style={{ left: `calc(${progressPercentage}% - 5px)` }}
                                    />
                                </div>

                                {/* Digital Time Stamps */}
                                <div className="flex justify-between w-full text-[10px] text-slate-500 font-mono select-none px-0.5">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>

                        {/* 👉 Right Column: Completely snapped layout alignment */}
                        <div className="flex items-center justify-end gap-5 pl-2">
                            {/* 🌐 New Tool Sub-Group: Caption & Screen Controls */}
                            <div className="flex items-center gap-1.5 border-r border-slate-800/80 pr-3">
                                {/* Subtitle Toggle Button */}
                                <button
                                    onClick={handleSubtitleToggle} // FIXME: ALLOW SUBTITLES TO BE TURN ON AND OFF
                                    className={`p-1.5 rounded-md transition-colors ${subtitlesEnabled
                                        ? "text-cyan-400 bg-cyan-500/10"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                        }`}
                                    title="Toggle Subtitles"
                                >
                                    <MdSubtitles className="w-5 h-5" />
                                </button>

                                {/* Fullscreen Trigger Button */}
                                <button
                                    onClick={handleToggleFullscreen}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                                    title="Maximize View"
                                >
                                    <MdFullscreen className="w-6 h-6" />
                                </button>
                            </div>
                            {/* Left Sub-Group: Pure Volume Slider */}
                            <div className="flex items-center">
                                <Slider
                                    defaultValue={[50]}
                                    value={[volume]}
                                    max={100}
                                    step={1}
                                    onValueChange={(values) => setVolume(values[0])}
                                    className="w-24 hidden sm:flex cursor-pointer"
                                />
                            </div>

                            {/* Right Sub-Group: Speed Selection Element */}
                            <div className="relative inline-block">
                                <Select
                                    value={String(playbackRate)}
                                    onValueChange={(value) => setPlaybackRate(Number(value))}
                                >
                                    <SelectTrigger className="w-16 bg-transparent border-slate-800 text-slate-400 text-[11px] font-medium h-6 px-2 focus:ring-0 focus:ring-offset-0 focus:outline-hidden hover:bg-slate-800/40 transition-colors">
                                        <span className="w-full text-center">
                                            {playbackRate === 1.0 ? "1.0x" : `${playbackRate}x`}
                                        </span>
                                    </SelectTrigger>

                                    <SelectContent
                                        position="popper"
                                        sideOffset={4}
                                        className="bg-[#0f111a]/95 backdrop-blur-md border border-slate-800 text-slate-300 min-w-[4.5rem] p-1 rounded-md z-[9999]"
                                    >
                                        <SelectGroup>
                                            <SelectLabel className="text-slate-500 text-[9px] font-bold uppercase tracking-wider px-2 py-1 select-none">
                                                Speed
                                            </SelectLabel>
                                            {[0.25, 0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                                                <SelectItem
                                                    key={rate}
                                                    value={String(rate)}
                                                    className="text-xs rounded-sm cursor-pointer py-1.5 px-2 transition-colors duration-150 text-slate-300 outline-hidden data-[highlighted]:!bg-cyan-500/10 data-[highlighted]:!text-cyan-400 data-[state=checked]:!text-cyan-400 data-[state=checked]:font-semibold"
                                                >
                                                    {rate === 1.0 ? "1.0x" : `${rate}x`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECTANGLE 3: Sidebar Tracklist */}
                <div className="bg-[#1e2230] border border-slate-800 rounded-xl py-5 flex flex-col h-full shadow-lg max-h-full overflow-hidden items-stretch w-full min-w-0">
                    <h3 className="text-sm font-bold text-slate-400 tracking-widest mb-4 border-b border-slate-800 pb-3 mx-5 truncate" title={albumName}>
                        {albumName}
                    </h3>

                    <ScrollArea className="flex-1 min-h-0 w-full">
                        <div className="space-y-2 pb-4 px-5 w-full min-w-0">
                            {songs.map((song, index) => (
                                <Fragment key={song.id}>
                                    {/* FIXED WRAPPER CONTAINER: Added flex, min-w-0, and overflow handling */}
                                    <div
                                        className="flex min-w-0 w-full overflow-hidden p-4 bg-[#151821]/50 hover:bg-[#151821] border border-slate-800/40 hover:border-slate-700/60 rounded-xl text-sm text-slate-300 cursor-pointer transition-all duration-150"
                                        onClick={() => playAlbum(songs, index)}
                                    >
                                        <AlbumSongCard
                                            title={song.title}
                                            url={song.url}
                                            isBeingListened={currentSong?.url === song.url}
                                            /* Click event is handled beautifully by the parent item wrapper */
                                            onClick={() => { }}
                                            moods={song.moods}
                                        />
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="px-5 z-10 flex flex-col justify-end bg-transparent flex-shrink-0">
                        <Button
                            onClick={() => navigate("/player")}
                            className="w-full h-12 mt-6 cursor-pointer bg-[#151821] hover:bg-[#1c1f2b] text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-slate-700 rounded-xl font-semibold tracking-wide shadow-md transition-all text-sm"
                        >
                            Back To Album List
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlbumPlayer

{/*
    CURRENT UNSOLVABLE BUG: HAVING A WORKING SUBTITLE. CONSIDER THIS IN THE FUTURE:
Fetch the .srt or YouTube caption track data via an API endpoint backend.

Listen to the onTimeUpdate event from your player.

Filter and render the matching subtitle text into a custom styled <div> positioned right over your player component.
*/}
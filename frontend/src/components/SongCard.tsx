import type { SongType } from "./pages/SongSection";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    Card,
    CardAction,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import MoodToSong from "./MoodPicker";
import axios from "axios";
import { toast } from "sonner";
import { IoIosRemoveCircle } from "react-icons/io";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import api from "../lib/axios";
interface SongCardProps extends SongType {
    onMoodUpdate: () => void
    deleteFilter: boolean
    onSongUpdate: () => void
}

const SongCard = ({ id, title, url, isFavorite, moods, onMoodUpdate, deleteFilter, onSongUpdate }: SongCardProps) => {
    const [isliked, setIsLiked] = useState(isFavorite)
    function getYouTubeID(youtubeUrl: string) {
        return new URLSearchParams(new URL(youtubeUrl).search).get("v");
    }
    const youtubeUrl = getYouTubeID(url)
    const thumbnail = "https://img.youtube.com/vi/" + youtubeUrl + "/maxresdefault.jpg"
    const navigate = useNavigate()
    const isMounted = useRef(false)
    const isUserAction = useRef(false)
    const [filter, setFilter] = useState(false)
    const removeMood = async (moodID: number) => {
        try {
            await api.delete(`http://localhost:8080/song/songs/${id}/moods/${moodID}`)
            await onMoodUpdate()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            }
            else {
                toast.error("Something went wrong.")
            }
        }
    }
    const removeSong = async (songID: number) => {
        try {
            await api.delete(`http://localhost:8080/song/songs/${songID}`)
            await onSongUpdate()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data)
            }
            else {
                toast.error("Something went wrong.")
            }
        }
    }
    useEffect(() => {
        const updateFavorite = async () => {
            try {
                await api.put(`http://localhost:8080/song/songs/${id}`,
                    { isFavorite: isliked }
                )
                if (isliked) {
                    toast.success("Added into Favorite!")
                }
                else {
                    toast.success("Remove from Favorite!")
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.error(error.response.data)
                }
                else {
                    toast.error("Something went wrong.")
                }
            }
        }
        if (!isMounted.current) {
            isMounted.current = true
            return
        }
        if (!isUserAction.current) return
        isUserAction.current = false
        updateFavorite()
    }, [isliked])
    useEffect(() => {
        setIsLiked(isFavorite)
    }, [isFavorite])
    return (
        <Card
            className="relative mx-auto w-full max-w-sm pt-0 flex flex-col h-full"
            style={{ ...(deleteFilter ? { boxShadow: "0 0 30px 12px rgba(255, 0, 0, 0.7)", transition: "box-shadow 0.1s ease" } : {}), cursor: "pointer" }}
            onClick={(e) => {
                if (deleteFilter) {
                    e.stopPropagation()
                    removeSong(id)
                }
                else {
                    navigate(`/song/${id}`)
                }
            }}>
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src={thumbnail}
                alt="Youtube Thumbnail"
                className="relative z-20 aspect-video w-full object-cover"
            />
            <CardHeader className="flex flex-col p-4 pt-0 gap-1.5">
                <CardAction className="flex items-center w-full gap-2">
                    <Badge variant="secondary">Featured</Badge>
                    <div className="ml-auto flex items-center gap-3 text-lg">
                        {isliked
                            ? <FaHeart onClick={(e) => {
                                isUserAction.current = true
                                setIsLiked(!isliked)
                                e.stopPropagation()
                            }} style={{ color: "red" }} className="cursor-pointer" />
                            : <FaRegHeart onClick={(e) => {
                                isUserAction.current = true
                                setIsLiked(!isliked)
                                e.stopPropagation()
                            }} className="cursor-pointer" />
                        }
                        {filter
                            ? <MdFilterAltOff onClick={(e) => {
                                setFilter(false)
                                e.stopPropagation()
                            }} className="cursor-pointer" />
                            : <MdFilterAlt onClick={(e) => {
                                setFilter(true)
                                e.stopPropagation()
                            }} className="cursor-pointer" />
                        }
                    </div>
                </CardAction>
                <CardTitle className="text-base font-semibold leading-snug line-clamp-2 h-[3rem]">
                    {title}
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                    {moods.map((m: any) => (
                        <div className="relative inline-block" key={m.id}>
                            <Badge variant="outline">{m.name}</Badge>
                            {filter && <IoIosRemoveCircle className="absolute -top-1 -right-1 cursor-pointer text-xs" onClick={(e) => {
                                e.stopPropagation()
                                removeMood(m.id)
                            }} />}
                        </div>
                    ))}
                </div>
                <MoodToSong songID={id} onMoodUpdate={() => onMoodUpdate()} currentMoods={moods} />
            </CardHeader>
            <CardFooter className="mt-auto pb-4 flex items-center justify-center">
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        window.open(url, "_blank")
                    }}
                    style={{ cursor: "pointer" }}
                >
                    Listen Song On Youtube
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SongCard
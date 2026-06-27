import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import type { MoodType } from "./pages/MoodSection"
import axios from "axios"
import { useToken } from "./context/TokenContext"
import { toast } from "sonner"
import api from "../lib/axios"
interface MoodToSongProps {
    songID: number
    onMoodUpdate: () => void
    currentMoods: MoodType[]
}
const MoodToSong = ({ songID, onMoodUpdate, currentMoods }: MoodToSongProps) => {
    const [allMoods, setAllMoods] = useState<MoodType[]>([])
    const [pickedMoods, setPickedMoods] = useState<Number[]>([])
    const { accessToken } = useToken()
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
    useEffect(() => {
        try {
            fetchAllMoods()
        } catch (error) {
            throw new Error((error as any).message)
        }
    }, [accessToken])
    const handleMoodClicked = (id: number) => {
        setPickedMoods(prev =>
            prev.includes(id)
                ? prev.filter(moodID => moodID !== id)
                : [...prev, id]
        )
    }
    const availableMoods = allMoods.filter(
        (md) => !currentMoods.some((cm) => cm.id === md.id)
    )
    const handleSubmit = async () => {
        try {
            // 1. Fire ALL requests simultaneously in parallel 
            const requests = pickedMoods.map(id =>
                api.put(`/song/songs/${songID}/moods/${id}`, {})
            );

            // Wait for all of them to successfully resolve in the cloud
            await Promise.all(requests);

            // 2. Fire exactly ONE success toast and ONE UI reload
            toast.success("Moods updated successfully!");
            await onMoodUpdate();

            // Clear out the selected checkmarks after saving
            setPickedMoods([]);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data);
            } else {
                toast.error("Something went wrong updating moods.");
            }
        }
    }
    return (
        <Dialog>
            <div onClick={(e) => e.stopPropagation()}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-fit"> + Add Mood</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Choose Your Mood</DialogTitle>
                        <DialogDescription>
                            Pick the mood you find that suit well to the song.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        {availableMoods.map((mood) => (
                            <Button key={mood.id}
                                onClick={() => handleMoodClicked(mood.id)}
                                className={`
                                        ${pickedMoods.includes(mood.id)
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                                        : ""}  
                                `} >{mood.name}</Button>
                        ))}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSubmit}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </div >
        </Dialog >
    )
}

export default MoodToSong
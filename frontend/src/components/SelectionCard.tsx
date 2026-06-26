import type { SongType } from "./pages/SongSection";
import {
    Card,
    CardAction,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

interface SelectionCardProps extends SongType {
    isSelected: boolean
    onClick: () => void
}

const SelectionCard = ({ id, title, url, isFavorite, moods, isSelected, onClick }: SelectionCardProps) => {
    function getYouTubeID(youtubeUrl: string) {
        return new URLSearchParams(new URL(youtubeUrl).search).get("v");
    }
    const youtubeUrl = getYouTubeID(url)
    const thumbnail = "https://img.youtube.com/vi/" + youtubeUrl + "/maxresdefault.jpg"
    return (
        <Card
            className={`relative mx-auto w-full max-w-sm pt-0 flex flex-col h-full ${!isSelected ? "opacity-75 grayscale" : ""}`}
            style={{ ...(isSelected ? { boxShadow: "0 0 30px 12px rgba(168, 85, 247, 0.7)", transition: "box-shadow 0.1s ease" } : {}), cursor: "pointer" }}
            onClick={onClick}
        >
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
                        {isFavorite
                            ? <FaHeart style={{ color: "red" }} />
                            : <FaRegHeart />
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
                        </div>
                    ))}
                </div>
            </CardHeader>
        </Card>
    )
}

export default SelectionCard
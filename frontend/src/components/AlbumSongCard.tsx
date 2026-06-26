import type { MoodType } from "./pages/MoodSection"

interface AlbumSongCardType {
    title: string
    url: string
    isBeingListened: boolean
    onClick: () => void
    moods: MoodType[]
}

const AlbumSongCard = ({ title, url, isBeingListened, onClick, moods }: AlbumSongCardType) => {
    function getYouTubeID(youtubeUrl: string) {
        return new URLSearchParams(new URL(youtubeUrl).search).get("v");
    }
    const youtubeUrl = getYouTubeID(url)
    const thumbnail = "https://img.youtube.com/vi/" + youtubeUrl + "/maxresdefault.jpg"

    return (
        <div
            className="flex items-center gap-3 flex-1 min-w-0 w-full group/item overflow-hidden"
            style={{ ...(isBeingListened ? { boxShadow: "0 0 30px 12px rgba(168, 85, 247, 0.7)", transition: "box-shadow 0.1s ease" } : {}), cursor: "pointer" }}
            onClick={onClick}
        >
            {/* 1. Rigid Thumbnail Container with fixed width aspect ratio layout */}
            <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800/80 shrink-0 shadow-inner">
                <img
                    src={thumbnail}
                    alt="Youtube Thumbnail"
                    className="w-full h-full object-cover transition-transform duration-200 group-hover/item:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover/item:bg-black/0 transition-colors duration-150" />
            </div>

            {/* 2. Text Content Block */}
            <div className="flex flex-col flex-1 min-w-0 justify-center overflow-hidden">
                <h4
                    className="text-sm font-semibold leading-tight text-slate-200 group-hover/item:text-purple-400 transition-colors duration-150 truncate block"
                    title={title}
                >
                    {title}
                </h4>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide mt-1 uppercase whitespace-nowrap">
                    YOUTUBE TRACK
                </span>
            </div>
        </div>
    )
}

export default AlbumSongCard
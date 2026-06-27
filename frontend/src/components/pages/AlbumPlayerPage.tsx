import { useToken } from "../context/TokenContext"
import { useEffect, useState } from "react"
import type { SongType } from "./SongSection"
import AlbumCard from "../AlbumCard"
import api from "../../lib/axios"
export interface AlbumType {
    id: number,
    name: string,
    createdAt: Date,
    songs: SongType[]
}
const AlbumPlayerPage = () => {
    const { accessToken } = useToken()
    const [allAlbums, setAllAlbums] = useState<AlbumType[]>([])
    const fetchAllAlbums = async () => {
        try {
            const request = await api.get("/album/albums")
            const albums: AlbumType[] = request.data
            const newAlbums = albums.map((album) => ({
                id: album.id,
                name: album.name,
                createdAt: album.createdAt,
                songs: album.songs
            }))
            setAllAlbums(newAlbums)
        } catch (error) {
            throw new Error((error as any).message)
        }
    }
    useEffect(() => {
        try {
            fetchAllAlbums()
        } catch (error) {
            throw new Error((error as any).message)
        }
    }, [accessToken])
    return (
        <div className="w-full min-h-screen bg-[#0f111a] p-6 md:p-12 text-slate-100 flex flex-col items-center">
            {/* 1. Area that store the album*/}
            <div className="w-full max-w-5xl space-y-10">
                <div className="border-b border-slate-800/80 pb-6">
                    <h1 className="text-3xl font-black text-white tracking-wide uppercase">
                        Your Playable Albums
                    </h1>
                    <p className="text-base text-slate-400 mt-2 font-medium">
                        Start Listening To Your Created Albums!
                    </p>
                </div>

                {/* 2. The Album Cards List Wrapper */}
                <div className="space-y-6">
                    {allAlbums.length === 0 ? (
                        // Edge case: User has zero albums
                        <div className="flex flex-col items-center justify-center min-h-[350px] border border-dashed border-slate-800/80 rounded-2xl p-8 text-center bg-[#151821]/20 backdrop-blur-sm animate-fade-in">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                                <span className="text-xl">💿</span>
                            </div>
                            <h3 className="text-base font-semibold text-slate-200 mb-1">Your Player is Empty</h3>
                            <p className="text-xs text-slate-500 max-w-sm mb-6">
                                You haven't generated any playable music albums yet. Head over to selection to bundle your tracks.
                            </p>
                        </div>
                    ) : (
                        allAlbums.map((album) => (
                            <AlbumCard
                                key={album.id}
                                id={album.id}
                                name={album.name}
                                createdAt={album.createdAt}
                                songs={album.songs}
                                onAlbumUpdate={() => fetchAllAlbums()}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default AlbumPlayerPage
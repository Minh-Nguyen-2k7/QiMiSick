import { Link } from "react-router-dom"
import { Music, Smile } from "lucide-react"

export default function MusicLibrary() {
    return (
        <div className="max-w-4xl space-y-6">
            {/* Context Heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your Library Workspace</h1>
                <p className="text-sm text-slate-500">Manage your tracking data configurations and audio library profiles.</p>
            </div>

            {/* Hub Workspace Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 🎵 Track Collection Dashboard Card */}
                <Link
                    to="/library/song"
                    className="group relative flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                    <div className="space-y-3">
                        <div className="p-3 w-fit bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Music className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Song Database</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                View and manage all the songs in your database collection.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        Open Song Collections &rarr;
                    </div>
                </Link>

                {/* 😄 Mood Dimension Layout Card */}
                <Link
                    to="/library/mood"
                    className="group relative flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                    <div className="space-y-3">
                        <div className="p-3 w-fit bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Smile className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Mood Analytics & Tags</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Configure and organize your listening mood filters.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 text-xs font-semibold text-purple-600 group-hover:text-purple-700 flex items-center gap-1">
                        Manage Your Moods &rarr;
                    </div>
                </Link>

            </div>
        </div>
    )
}
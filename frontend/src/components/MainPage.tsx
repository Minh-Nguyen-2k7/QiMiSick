import { useNavigate } from "react-router-dom"

const MainPage = () => {
    const navigate = useNavigate()
    // Inside your component:
    const handleLaunch = () => {
        // Check if a token exists in localStorage/cookies
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/app/library"); // Go straight to your music player layout
        } else {
            navigate("/login"); // Prompt them to log in first
        }
    };
    return (
        <div>
            <div className="min-h-screen bg-black text-zinc-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">

                {/* BACKGROUND ATMOSPHERIC GLOWS */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden z-0 opacity-40">
                    <div className="absolute -top-[250px] left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
                    <div className="absolute -top-[200px] right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[130px]" />
                </div>

                {/* HEADER NAVBAR */}
                <header className="relative z-10 border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                                <span className="text-black font-black text-sm">Q</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                QiMiSick
                            </span>
                        </div>
                        <div>
                            <button onClick={() => navigate("/register")} className="px-4 h-9 rounded-md text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-colors shadow-sm mr-5">
                                Register
                            </button>
                            <button onClick={() => navigate("/login")} className="px-4 h-9 rounded-md text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-colors shadow-sm">
                                Login
                            </button>
                        </div>
                    </div>
                </header>

                {/* HERO SECTION */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-xs font-medium text-cyan-400 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Personalized Mood-Based Recommendations
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                        Own Your Audio. <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                            Curate Your Mood.
                        </span>
                    </h1>

                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
                        Import your favorite albums, tag tracks by their raw energy, and let a personal recommender engine shuffle your library based on how you feel right now.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={handleLaunch} className="w-full sm:w-auto px-8 h-12 rounded-lg font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:shadow-[0_0_35px_rgba(34,211,238,0.45)] transition-all transform hover:-translate-y-0.5 duration-200">
                            Launch Archive
                        </button>
                        <a
                            href="https://github.com/Minh-Nguyen-2k7/QiMiSick"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-6 h-12 rounded-lg font-medium bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300 flex items-center justify-center gap-2 transition-all"
                        >
                            View Code
                        </a>
                    </div>
                </section>

                {/* INTERACTIVE DASHBOARD SHOWCASE (Tightened Width & Fixed Thumbnail) */}
                <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
                    <div className="relative border border-zinc-900 rounded-xl bg-[#090a0f]/80 backdrop-blur-xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left">
                        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-cyan-500/5 to-fuchsia-500/5 blur-xl" />

                        {/* Header Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-zinc-500 text-xs font-medium cursor-pointer hover:text-zinc-400 transition-colors">
                                ← Back to Library
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md text-xs transition-colors">
                                    + Add Mood
                                </button>
                                <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-md text-xs transition-colors">
                                    Delete Mood
                                </button>
                            </div>
                        </div>

                        {/* Vibe Title Focus */}
                        <div className="mb-8">
                            <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider block mb-1">Current Active Vibe</span>
                            <h3 className="text-2xl font-bold text-zinc-100">
                                Vibe Focus: <span className="text-cyan-400">High Energy Beats</span>
                            </h3>
                        </div>

                        {/* Table Headers */}
                        <div className="grid grid-cols-12 px-4 mb-2 text-[10px] font-bold font-mono tracking-wider text-zinc-600 uppercase">
                            <div className="col-span-1">#</div>
                            <div className="col-span-6 sm:col-span-7">Track Information</div>
                            <div className="col-span-3 sm:col-span-3">Connected Mood Tags</div>
                            <div className="col-span-2 sm:col-span-1 text-right">Action</div>
                        </div>

                        {/* Well-Known Track Rows with Valid Thumbnails */}
                        <div className="flex flex-col gap-2">
                            {[
                                {
                                    id: 1,
                                    title: "Coldplay - Viva La Vida",
                                    url: "https://www.youtube.com/watch?v=dvgZkm1xWPE...",
                                    img: "https://img.youtube.com/vi/dvgZkm1xWPE/hqdefault.jpg",
                                    tags: ["Orchestral Pop", "Melodic Vibe"]
                                },
                                {
                                    id: 2,
                                    title: "The Weeknd - Blinding Lights",
                                    url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ...",
                                    img: "https://img.youtube.com/vi/4NRXx6U8ABQ/hqdefault.jpg",
                                    tags: ["Synthwave Focus", "Car Playlist"]
                                },
                                {
                                    id: 3,
                                    title: "Avicii - Wake Me Up",
                                    url: "https://www.youtube.com/watch?v=IcrbM1l_BoI...",
                                    img: "https://img.youtube.com/vi/IcrbM1l_BoI/hqdefault.jpg",
                                    tags: ["Festival Anthems", "Gym Motivation"]
                                },
                                {
                                    id: 4,
                                    title: "Calvin Harris - Summer",
                                    url: "https://www.youtube.com/watch?v=ebXbLfLACGM...",
                                    img: "https://img.youtube.com/vi/ebXbLfLACGM/hqdefault.jpg",
                                    tags: ["High Energy Beats", "Summer Vibes"]
                                },
                                {
                                    id: 5,
                                    title: "Billie Eilish - Bad Guy",
                                    url: "https://www.youtube.com/watch?v=DyDfgMOUjCI...",
                                    img: "https://img.youtube.com/vi/DyDfgMOUjCI/hqdefault.jpg",
                                    tags: ["Dark Pop", "Bass Heavy"]
                                }
                            ].map((track) => (
                                <div key={track.id} className="grid grid-cols-12 items-center bg-[#0d0e14] border border-zinc-900/60 hover:border-zinc-800/80 rounded-lg p-2.5 transition-all">

                                    {/* Number */}
                                    <div className="col-span-1 font-mono text-xs text-zinc-600 pl-1">{track.id}</div>

                                    {/* Details with Thumbnail */}
                                    <div className="col-span-6 sm:col-span-7 pr-4 flex items-center gap-3 truncate">
                                        <img
                                            src={track.img}
                                            alt={track.title}
                                            className="w-10 h-10 object-cover rounded border border-zinc-800/80 shrink-0"
                                        />
                                        <div className="truncate">
                                            <h4 className="text-xs font-semibold text-zinc-200 truncate mb-0.5">{track.title}</h4>
                                            <span className="text-[10px] font-mono text-zinc-600 block truncate">{track.url}</span>
                                        </div>
                                    </div>

                                    {/* Mood Badges */}
                                    <div className="col-span-3 sm:col-span-3 flex flex-wrap gap-1.5">
                                        {track.tags.map((tag, idx) => (
                                            <span key={idx} className="px-2 py-0.5 rounded text-[9px] font-medium font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-2 sm:col-span-1 text-right pr-1">
                                        <button className="px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-500/20 rounded text-[10px] font-semibold transition-colors">
                                            Play Song
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* BENTO FEATURES GRID (Updated to reflect actual app functionality) */}
                <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-zinc-100">
                            Your Music, Categorized by{" "}
                            <span className="bg-gradient-to-l from-cyan-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                                Vibe.
                            </span>
                        </h2>
                        <p className="text-zinc-500 text-sm max-w-md mx-auto">
                            Skip the generic platform algorithms. Take full control of how your music is organized and discovered.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {/* Card 1: Mood Curation */}
                        <div className="md:col-span-2 border border-zinc-900 rounded-xl bg-zinc-950/30 p-6 flex flex-col justify-between group hover:border-zinc-800 transition-colors">
                            <div>
                                <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                                    🎨
                                </div>
                                <h3 className="text-lg font-bold mb-2">Emotion-Driven Tagging</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                                    Assign custom emotion tags to individual tracks. Filter your library instantly by active headspace—whether you need deep focus beats, a raw energy spike, or a low-fi moment.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                                <span>Dynamic Mood Association</span>
                                <span className="text-cyan-400">Connected Tags</span>
                            </div>
                        </div>

                        {/* Card 2: YouTube Ingestion */}
                        <div className="border border-zinc-900 rounded-xl bg-zinc-950/30 p-6 flex flex-col justify-between group hover:border-zinc-800 transition-colors">
                            <div>
                                <div className="w-8 h-8 rounded bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-4 group-hover:scale-105 transition-transform">
                                    📥
                                </div>
                                <h3 className="text-lg font-bold mb-2">Instant URL Parsing</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Paste standard YouTube links or custom playlist keys to automatically fetch titles, track paths, and valid video metadata straight into your collection.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-zinc-900/60 text-xs text-zinc-600 font-mono">
                                Metadata extraction ready
                            </div>
                        </div>

                        {/* Card 3: Custom Shuffling */}
                        <div className="border border-zinc-900 rounded-xl bg-zinc-950/30 p-6 flex flex-col justify-between group hover:border-zinc-800 transition-colors">
                            <div>
                                <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                                    🎲
                                </div>
                                <h3 className="text-lg font-bold mb-2">Smart Fair Shuffle</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Break free from repetitive loops. Use a custom written backend distribution step designed to shuffle curated vibe sets fairly without repeating the same artists sequentially.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-zinc-900/60 text-xs text-zinc-600 font-mono">
                                Anti-clustering engine
                            </div>
                        </div>

                        {/* Card 4: Album Creation */}
                        <div className="md:col-span-2 border border-zinc-900 rounded-xl bg-zinc-950/30 p-6 flex flex-col justify-between group hover:border-zinc-800 transition-colors">
                            <div>
                                <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                                    🗂️
                                </div>
                                <h3 className="text-lg font-bold mb-2">Custom Album Building</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                                    Group selections seamlessly. Take multiple tracks across varied original sources and forge unified custom albums bound by a singular thematic vibe or continuous audio flow.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                                <span>Structural asset generation</span>
                                <span className="text-emerald-400">Create Album</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER CALL TO ACTION */}
                <footer className="border-t border-zinc-900 bg-zinc-950/20 relative z-10">
                    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-400 tracking-tight">Qimisick</span>
                            <span>© 2026 Audio Archive Engine.</span>
                        </div>
                        <div className="flex items-center gap-6 font-medium">
                            <a href="https://github.com/Minh-Nguyen-2k7/QiMiSick" className="hover:text-zinc-300 transition-colors">GitHub Repository</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default MainPage
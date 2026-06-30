import { useNavigate, useLocation } from "react-router-dom"
import api from "../lib/axios"


const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation() // Helps light up the active navigation tab

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken")
            await api.delete("/logout", { data: { refreshToken } })
        } catch (error) {
            console.error("Logout session clean failed:", error)
        } finally {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            navigate("/login")
        }
    }

    // Helper to style buttons uniformly depending on if they are the active route view
    const getTabClass = (path: string) => {
        const isActive = location.pathname === path || (path === "/selection" && location.pathname === "/")
        return `w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${isActive
            ? "bg-slate-100 text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`
    }

    return (
        // ⚡ 'flex-shrink-0' guarantees the workspace grid cannot squeeze or resize this sidebar column
        <div className="w-52 h-full flex-shrink-0 border-r border-slate-200 bg-white flex flex-col p-4 select-none">

            {/* App Branding Title */}
            <div className="px-3 mb-6 font-bold tracking-tight text-slate-900 text-lg">
                QiMiSick
            </div>

            {/* Application Section Navigation Tabs */}
            <nav className="flex flex-col gap-1">
                <button className={getTabClass("/app/selection")} onClick={() => navigate("/app/selection")}>Music Selection</button>
                <button className={getTabClass("/app/player")} onClick={() => navigate("/app/player")}>Album Player</button>
                <button className={getTabClass("/app/library")} onClick={() => navigate("/app/library")}>Music Library</button>
            </nav>

            {/* Fixed Sticky Floor Logout Action */}
            <button
                onClick={handleLogout}
                className="mt-auto w-full text-left px-3 py-2 text-sm font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50/60 rounded-lg transition-all duration-150 border-t border-slate-100 pt-4"
            >
                Logout
            </button>
        </div>
    )
}

export default Sidebar
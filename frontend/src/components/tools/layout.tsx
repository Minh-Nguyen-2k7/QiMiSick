import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar"

const Layout = () => {

    return (
        <div className="fixed inset-0 flex w-screen overflow-hidden bg-slate-50 text-slate-800">

            {/* Left Sidebar (Stays perfectly static) */}
            <Sidebar />

            {/* Right Main Panel Sandbox (Only this scroll area works) */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-4 pb-6 px-6 md:px-8">
                <Outlet />
            </main>
        </div>
    )
}
export default Layout
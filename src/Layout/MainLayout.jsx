import { Outlet } from "react-router";
import Navber from "../components/Navber/Navber";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sideber/Sidebar";
import { useState } from "react";
import { FaBars } from "react-icons/fa";


const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="drawer lg:drawer-open bg-base-200 ">

            {/* Drawer Toggle */}
            <input
                id="dashboard-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={sidebarOpen}
                onChange={(e) => setSidebarOpen(e.target.checked)}
            />

            {/* ==========================
            MAIN CONTENT
      =========================== */}
            <div className="drawer-content flex flex-col min-h-screen">

                {/* Navbar */}
                <Navber
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />

            </div>

            {/* ==========================
            SIDEBAR
      =========================== */}
            <div className="drawer-side z-50">

                {/* Overlay */}
                <label
                    htmlFor="dashboard-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    onClick={() => setSidebarOpen(false)}
                ></label>

                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

            </div>

        </div>
    );
};

export default MainLayout;
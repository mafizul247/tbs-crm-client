import { Outlet } from "react-router";
import Navber from "../components/Navber/Navber";
import Footer from "../components/Footer/Footer";


const BackupMainLayout = () => {
    return (
        <div className="min-h-screen max-w-7xl mx-auto flex flex-col gap-4">
            <Navber />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default BackupMainLayout;
import { useState } from "react";
import { NavLink } from "react-router";
import {
    FaChevronDown,
    FaChevronRight,
    FaTachometerAlt,
    FaUsers,
    FaUserPlus,
    FaUserCheck,
    FaUserClock,
    FaUserTimes,
    FaFileInvoiceDollar,
    FaPlusCircle,
    FaMoneyCheckAlt,
    FaChartBar,
    FaTimes,
} from "react-icons/fa";

const Sidebar = ({ setSidebarOpen }) => {
    const [crmOpen, setCrmOpen] = useState(false);
    const [masterOpen, setMasterOpen] = useState(false);
    const [billingOpen, setBillingOpen] = useState(false);

    const closeDrawer = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const menuClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg ${isActive
            ? "bg-primary text-white"
            : "hover:bg-base-300 duration-200"
        }`;

    return (
        // <aside className="w-72 min-h-full bg-base-100 border-r shadow-lg">
        <aside className="w-72 min-h-full bg-base-100 shadow-lg">

            {/* Logo */}
            {/* <div className="p-5 border-b"> */}
            <div className="p-5">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-primary">
                            PMS ERP
                        </h2>

                        <p className="text-xs opacity-60">
                            Project Management System
                        </p>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="btn btn-primary btn-circle lg:hidden"
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>

            {/* Menu */}
            <ul className="menu p-4 text-base-content">

                {/* Dashboard */}
                <li>
                    <NavLink
                        to="/"
                        end
                        className={menuClass}
                        onClick={closeDrawer}
                    >
                        <FaTachometerAlt />
                        Dashboard
                    </NavLink>
                </li>

                {/* CRM */}
                <li className="mt-2">

                    <button
                        onClick={() => setCrmOpen(!crmOpen)}
                        className="flex justify-between items-center rounded-lg hover:bg-base-300"
                    >
                        <span className="flex items-center gap-3">
                            <FaUsers />
                            CRM
                        </span>

                        {crmOpen ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}
                    </button>

                    {crmOpen && (
                        <ul className="ml-2 mt-2 space-y-1">

                            <li>
                                <NavLink
                                    to="/crm-dashboard"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaTachometerAlt />
                                    CRM Dashboard
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/leads"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaUsers />
                                    Leads
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/create-lead"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaPlusCircle />
                                    Create Lead
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/clients"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaUserPlus />
                                    Clients
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/create-client"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaPlusCircle />
                                    Create Client
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/new-client"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaPlusCircle />
                                    New Client
                                </NavLink>
                            </li>

                        </ul>
                    )}
                </li>

                {/* Billing */}
                {/* <li className="mt-3">

                    <button
                        onClick={() => setBillingOpen(!billingOpen)}
                        className="flex justify-between items-center rounded-lg hover:bg-base-300"
                    >
                        <span className="flex items-center gap-3">
                            <FaFileInvoiceDollar />
                            Billing Management
                        </span>

                        {billingOpen ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}
                    </button>

                    {billingOpen && (
                        <ul className="ml-2 mt-2 space-y-1">

                            <li>
                                <NavLink
                                    to="/billing/invoices"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaFileInvoiceDollar />
                                    Invoices
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/billing/create-invoice"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaPlusCircle />
                                    Create Invoice
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/billing"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaMoneyCheckAlt />
                                    Billing
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/billing/report"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaChartBar />
                                    Reports
                                </NavLink>
                            </li>

                        </ul>
                    )}
                </li> */}

                {/* Master Data */}
                <li className="mt-3">

                    <button
                        onClick={() => setMasterOpen(!masterOpen)}
                        className="flex justify-between items-center rounded-lg hover:bg-base-300"
                    >
                        <span className="flex items-center gap-3">
                            <FaFileInvoiceDollar />
                            Master Data
                        </span>

                        {masterOpen ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}
                    </button>

                    {masterOpen && (
                        <ul className="ml-2 mt-2 space-y-1">

                            <li>
                                <NavLink
                                    to="/users"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaUsers />
                                    Users
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/register"
                                    className={menuClass}
                                    onClick={closeDrawer}
                                >
                                    <FaPlusCircle />
                                    User Register
                                </NavLink>
                            </li>

                        </ul>
                    )}
                </li>

            </ul>

        </aside>
    );
};

export default Sidebar;
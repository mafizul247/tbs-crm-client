import { NavLink } from "react-router";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const MenuItem = ({ item, closeDrawer }) => {
    const [open, setOpen] = useState(item.defaultOpen || false);

    const activeClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg transition-all duration-200 ${isActive
            ? "bg-primary text-primary-content"
            : "hover:bg-base-300"
        }`;

    // ==========================
    // Menu with Submenu
    // ==========================

    if (item.children) {
        return (
            <li>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between rounded-lg hover:bg-base-300"
                >
                    <span className="flex items-center gap-3">
                        <item.icon />
                        {item.title}
                    </span>

                    {open ? <FaChevronDown /> : <FaChevronRight />}
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-2" : "max-h-0"
                        }`}
                >
                    <ul className="ml-4 space-y-1">

                        {item.children.map((child) => (
                            <li key={child.path}>

                                <NavLink
                                    to={child.path}
                                    className={activeClass}
                                    onClick={closeDrawer}
                                >
                                    <child.icon />

                                    {child.title}

                                </NavLink>

                            </li>
                        ))}

                    </ul>
                </div>

            </li>
        );
    }

    // ==========================
    // Single Menu
    // ==========================

    return (
        <li>

            <NavLink
                to={item.path}
                end
                className={activeClass}
                onClick={closeDrawer}
            >
                <item.icon />

                {item.title}

            </NavLink>

        </li>
    );
};

export default MenuItem;
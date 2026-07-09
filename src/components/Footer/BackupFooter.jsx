import { useTranslation } from "react-i18next";
// import { NavLink } from "react-router";


const BKFooter = () => {
    const { t, i18n } = useTranslation();

    // optional theme toggle (same as navbar)
    const toggleTheme = () => {
        const html = document.documentElement;
        const current = html.getAttribute("data-theme");
        html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
    };

    // const navClass = ({ isActive }) => isActive && "text-primary font-semibold";

    return (
        <footer className="bg-base-200 text-base-content mt-10">

            <div className=" p-4 text-center text-sm">
                    © {new Date().getFullYear()} PMS — {t("rights")} {t("author_name")}
                </div>

            {/* <div className="max-w-7xl mx-auto px-4 py-10"> */}

                {/* GRID */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"> */}

                    {/* Logo / About */}
                    {/* <div> */}
                        {/* <h2 className="text-xl font-bold">{t("tax")}</h2> */}
                        {/* <img className="w-12" src="https://i.ibb.co.com/m571y2Ny/tax-icon-1.png" alt="Footer Image" />
                        <p className="mt-2 text-sm">
                            {t("footer_desc")}
                        </p> */}
                    {/* </div> */}

                    {/* Links (NOW USING NavLink) */}
                    {/* <div>
                        <h3 className="font-semibold mb-2">
                            {t("quick_links")}
                        </h3>

                        <ul className="space-y-1">

                            <li>
                                <NavLink to="/" className={navClass}>
                                    {t("home")}
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/about" className={navClass}>
                                    {t("about")}
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/contact" className={navClass}>
                                    {t("contact")}
                                </NavLink>
                            </li>

                        </ul>
                    </div> */}

                    {/* Settings */}
                    {/* <div> */}
                        {/* <h3 className="font-semibold mb-2">
                            {t("settings")}
                        </h3> */}

                        {/* <div className="flex justify-center md:justify-start gap-2 flex-wrap"> */}

                            {/* Language Toggle */}
                            {/* <button
                                onClick={() =>
                                    i18n.changeLanguage(
                                        i18n.language === "en" ? "bn" : "en"
                                    )
                                }
                                className="btn btn-sm"
                            >
                                {i18n.language === "en" ? "EN" : "বাং"}
                            </button> */}

                            {/* Theme Toggle */}
                            {/* <button onClick={toggleTheme} className="btn btn-sm">
                                🌙
                            </button> */}

                        {/* </div> */}
                    {/* </div> */}

                {/* </div> */}

                {/* Bottom */}
                {/* <div className="border-t mt-8 pt-4 text-center text-sm">
                    © {new Date().getFullYear()} {t("tax")} — {t("rights")} {t("author_name")}
                </div> */}

            {/* </div> */}
        </footer>
    );
};

export default BKFooter;
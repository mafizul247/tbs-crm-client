const Footer = () => {
    return (
        <footer className="border-t bg-base-100 px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-base-content/70">

                {/* Left */}
                <div>
                    © {new Date().getFullYear()}{" "}
                    <span className="font-semibold text-primary">
                        PMS ERP
                    </span>
                    . All Rights Reserved.
                </div>

                {/* Center */}
                <div>
                    Version <span className="font-medium">1.0.0</span>
                </div>

                {/* Right */}
                <div>
                    Developed by{" "}
                    <span className="font-semibold text-primary">
                        Technology and Business Solutions Ltd.
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
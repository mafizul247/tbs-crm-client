import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-base-100/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-5">
                {/* Spinner */}
                <span className="loading loading-spinner loading-lg text-primary w-16 h-16"></span>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold">
                        PMS <span className="text-primary">ERP</span>
                    </h2>

                    <p className="text-base-content/70 mt-1">
                        Loading...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
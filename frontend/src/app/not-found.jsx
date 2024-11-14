'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { Home as HomeIcon, ArrowBack } from '@mui/icons-material';

export default function NotFound() {
    // Optional: Track 404s
    useEffect(() => {
        // You could add analytics tracking here
        console.log('404 page visited');
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center animate-fadeIn">
                {/* Gradient Error Number */}
                <h1 className="text-[150px] font-bold leading-none gradient-text mb-8 animate-bounce">
                    404
                </h1>

                {/* Error Message */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for seems to have gone on vacation.
                    Let's get you back on track!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="button-primary inline-flex items-center justify-center gap-2 group"
                    >
                        <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="button-secondary inline-flex items-center justify-center gap-2 group"
                    >
                        <ArrowBack className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                        Go Back
                    </button>
                </div>

                {/* Visual Elements */}
                <div className="mt-12 flex justify-center gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full gradient-bg animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
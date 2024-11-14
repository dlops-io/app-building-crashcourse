'use client'
import { usePathname } from 'next/navigation';

export default function Footer() {

    const pathname = usePathname();
    const hideFooter = pathname === '/chat';

    if (hideFooter) return null;

    return (
        <footer className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-6 mt-auto">
            <div className="container mx-auto px-4">
                <p className="text-center text-white/90 text-sm">
                    Copyright © {new Date().getFullYear()} My Awesome App - All Rights Reserved.
                </p>
            </div>
        </footer>
    );

}
'use client'
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    if (pathname === '/chat') return null;

    return (
        <footer className="footer">
            <div className="layout-container">
                <p className="footer-text">
                    Copyright © {new Date().getFullYear()} My Awesome App - All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
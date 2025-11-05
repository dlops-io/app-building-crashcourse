'use client'

import { useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, X, BarChart, List, Grid3x3, Bot } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    // Component States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
        { name: 'Todo', path: '/todo', icon: <List className="h-5 w-5" /> },
        { name: 'Plots', path: '/plots', icon: <BarChart className="h-5 w-5" /> },
        { name: 'Grids', path: '/styletransfer', icon: <Grid3x3 className="h-5 w-5" /> },
        { name: 'AI Assistant', path: '/chat', icon: <Bot className="h-5 w-5" /> }
    ];

    // UI View
    return (
        <>
            <header className="header-wrapper">
                <div className="header-container">
                    <div className="header-content">
                        <Link href="/" className="header-logo">
                            <span className="text-2xl">✨</span>
                            <h1 className="text-xl font-bold font-montserrat">AC215 Awesome App</h1>
                        </Link>

                        <nav className="nav-desktop">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`nav-link ${pathname === item.path ? 'nav-link-active' : ''}`}
                                >
                                    <div className="nav-icon-wrapper">{item.icon}</div>
                                    <span className="nav-text">{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                className="mobile-menu-button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`mobile-menu ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                    {/* ... mobile menu content ... */}
                </div>
            </header>
            {isMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />}
        </>
    );
}
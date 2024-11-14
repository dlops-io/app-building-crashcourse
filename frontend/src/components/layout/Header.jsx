'use client'

import { useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Podcasts, Email, SmartToy, Menu, Close } from '@mui/icons-material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ListAltIcon from '@mui/icons-material/ListAlt';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/', icon: <Home sx={{ fontSize: 20 }} /> },
        { name: 'Todo', path: '/todo', icon: <ListAltIcon fontSize="small" /> },
        { name: 'Plots', path: '/plots', icon: <InsertChartIcon fontSize="small" /> },
        { name: 'AI Assistant', path: '/chat', icon: <SmartToy fontSize="small" /> }
    ];

    return (
        <>
            <header className="fixed w-full top-0 z-50">
                {/* Main Header */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-white hover:text-white/90 transition-colors flex items-center gap-2">
                            <span className="text-2xl">✨</span>
                            <h1 className="text-xl font-bold font-montserrat">My Awesome App</h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors ${pathname === item.path ? 'font-semibold' : ''
                                        }`}
                                >
                                    {/* Wrap icon in a div to control alignment */}
                                    <div className="flex items-center justify-center w-5 h-5">
                                        {item.icon}
                                    </div>
                                    {/* Add alignment class to text */}
                                    <span className="leading-none pt-0.5">{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <Close className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`absolute top-16 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 md:hidden shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'
                        }`}
                >
                    <nav className="container mx-auto py-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors ${pathname === item.path ? 'bg-white/10 text-white' : ''
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
}
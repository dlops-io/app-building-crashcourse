'use client'

import { useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Podcasts, Email, SmartToy } from '@mui/icons-material';
import styles from './Header.module.css';

const navItems = [
    { name: 'Home', path: '/', icon: <Home fontSize="small" /> },
    { name: 'Podcasts', path: '/podcasts', icon: <Podcasts fontSize="small" /> },
    { name: 'Newsletters', path: '/newsletters', icon: <Email fontSize="small" /> },
    { name: 'Cheese Assistant', path: '/chat', icon: <SmartToy fontSize="small" /> }
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={`w-6 h-5 flex flex-col justify-between transition-transform duration-300 ${isMenuOpen ? 'transform' : ''}`}>
                        <span className={`w-full h-0.5 bg-white transform transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-full h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-full h-0.5 bg-white transform transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>

                {/* Mobile Navigation */}
                <div className={`absolute top-16 left-0 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg md:hidden transition-transform duration-300 ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
                    }`}>
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors ${pathname === item.path ? 'font-semibold' : ''
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
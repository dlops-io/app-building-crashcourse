'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Info, Podcasts, Email, SmartToy } from '@mui/icons-material';
import styles from './Header.module.css';

const navItems = [
    { name: 'Home', path: '/', icon: <Home fontSize="small" /> },
    { name: 'Podcasts', path: '/podcasts', icon: <Podcasts fontSize="small" /> },
    { name: 'Newsletters', path: '/newsletters', icon: <Email fontSize="small" /> },
    { name: 'Cheese Assistant', path: '/chat', icon: <SmartToy fontSize="small" /> }
];

export default function Header() {
    // States
    const pathname = usePathname();

    // Handlers

    return (
        <header
            className={`fixed w-full top-0 z-50 transition-all duration-300 bg-black/90}`}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="text-white hover:text-white/90 transition-colors">
                    <h1 className="text-2xl font-bold font-montserrat">✨ My Awesome App</h1>
                </Link>

                <div className={styles.navLinks}>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.linkText}>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
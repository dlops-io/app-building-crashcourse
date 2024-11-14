'use client'
import { usePathname } from 'next/navigation';

import styles from './Footer.module.css';

export default function Footer() {

    const pathname = usePathname();
    const hideFooter = pathname === '/chat';

    if (hideFooter) {
        return (
            <></>
        )
    } else {
        return (
            <footer className={styles.footer}>
                <p>Copyright © {new Date().getFullYear()} My Awesome App - All Rights Reserved.</p>
            </footer>
        );
    }

}
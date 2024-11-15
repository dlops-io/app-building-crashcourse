import './globals.css';
//import './globals.neon.nights.css';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'My Awesome App',
    description: 'An awesome description here',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="h-full">
            <head>
                <link href="assets/logo.png" rel="shortcut icon" type="image/x-icon"></link>
            </head>
            <body className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow pt-16">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
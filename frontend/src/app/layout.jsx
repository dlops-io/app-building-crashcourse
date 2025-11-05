import './globals.css';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'AC215 Awesome App',
    description: 'Sample app components for AC215',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="h-full" suppressHydrationWarning>
            <head>
                <link href="assets/logo.svg" rel="shortcut icon" type="image/x-icon"></link>
            </head>
            <body className="flex flex-col min-h-screen">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <Header />
                    <main className="flex-grow pt-16">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
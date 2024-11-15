'use client';

import Link from 'next/link';

export default function Home() {
    return (
        <div className="page-wrapper">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to My Awesome App
                    </h1>
                    <p className="hero-description">
                        Discover amazing content, engage with our community, and stay updated with the latest podcasts and newsletters.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="button-primary">Get Started</button>
                        <button className="button-secondary">Learn More</button>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="content-section">
                <div className="content-grid">
                    <Link href="/image" className="block">
                        <div className="feature-card">
                            <h3 className="feature-card-title">Image Classification</h3>
                            <p className="feature-card-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </Link>

                    <Link href="/audio" className="block">
                        <div className="feature-card">
                            <h3 className="feature-card-title">Audio 2 Text</h3>
                            <p className="feature-card-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </Link>

                    <Link href="/text" className="block">
                        <div className="feature-card">
                            <h3 className="feature-card-title">Text 2 Audio</h3>
                            <p className="feature-card-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
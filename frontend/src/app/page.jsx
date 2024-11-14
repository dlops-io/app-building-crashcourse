'use client';

import Link from 'next/link';

export default function Home() {

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="pt-24 md:pt-32 pb-12 px-4 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-6 font-montserrat">
                        Welcome to My Awesome App
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Discover amazing content, engage with our community, and stay updated with the latest podcasts and newsletters.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow">
                            Get Started
                        </button>
                        <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link href="/image" className="block">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <h3 className="text-xl font-semibold mb-4 font-montserrat">Image Classification</h3>
                            <p className="text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </Link>

                    <Link href="/audio" className="block">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <h3 className="text-xl font-semibold mb-4 font-montserrat">Audio 2 Text</h3>
                            <p className="text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </Link>

                    <Link href="/text" className="block">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <h3 className="text-xl font-semibold mb-4 font-montserrat">Text 2 Audio</h3>
                            <p className="text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
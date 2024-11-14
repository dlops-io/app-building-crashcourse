'use client'

import Text2Audio from '@/components/text/Text2Audio';

export default function TextToAudioPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 font-montserrat">
                        Text to Speech
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Convert your text into natural-sounding speech
                    </p>
                </div>

                {/* Text to Audio Component */}
                <Text2Audio />
            </div>
        </div>
    );
}
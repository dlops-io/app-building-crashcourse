'use client'

import Audio2Text from '@/components/audio/Audio2Text';

export default function AudioPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 font-montserrat">
                        Audio to Text
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Convert speech to text using AI-powered transcription
                    </p>
                </div>

                {/* Audio Component */}
                <Audio2Text />
            </div>
        </div>
    );
}
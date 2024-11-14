'use client'

import ImageClassification from '@/components/image/ImageClassification';

export default function ImagePage() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 font-montserrat">
                        Image Classification
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Upload an image to classify its contents using AI
                    </p>
                </div>

                {/* Image Classification Component */}
                <ImageClassification />
            </div>
        </div>
    );
}
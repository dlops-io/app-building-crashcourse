'use client'

import StyleTransfer from '@/components/styletransfer/StyleTransfer';

export default function StyleTransferPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 font-montserrat">
                        Style Transfer
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Transform your photos using artistic styles
                    </p>
                </div>

                {/* Style Transfer Component */}
                <StyleTransfer />
            </div>
        </div>
    );
}
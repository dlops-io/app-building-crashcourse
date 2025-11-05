'use client'

import MapComponent from '@/components/map/MapComponent';

export default function MapPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary font-montserrat">
                        Property Finder
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Explore real estate listings on an interactive map
                    </p>
                </div>

                {/* Component */}
                <MapComponent />
            </div>
        </div>
    );
}
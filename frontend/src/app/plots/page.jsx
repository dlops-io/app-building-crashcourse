'use client'

import PlotDisplay from '@/components/plots/PlotDisplay';

export default function PlotsPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary font-montserrat">
                        Data Visualization
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Interactive charts and data analysis
                    </p>
                </div>

                {/* Plots Component */}
                <PlotDisplay />
            </div>
        </div>
    );
}
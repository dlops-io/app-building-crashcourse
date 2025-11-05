'use client'

import { useState } from 'react';
import StockDashboard from '@/components/plots/StockDashboard';
import PortfolioOverview from '@/components/plots/PortfolioOverview';

export default function PlotsPage() {
    const [view, setView] = useState('portfolio'); // 'portfolio' or 'detail'
    const [selectedStock, setSelectedStock] = useState(null);

    const handleSelectStock = (symbol) => {
        setSelectedStock(symbol);
        setView('detail');
    };

    const handleBackToPortfolio = () => {
        setView('portfolio');
        setSelectedStock(null);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary font-montserrat">
                        {view === 'portfolio' ? 'Portfolio Dashboard' : 'Stock Analysis'}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {view === 'portfolio'
                            ? 'Monitor your portfolio performance and track market trends'
                            : 'Professional real-time market analytics and technical indicators'
                        }
                    </p>
                </div>

                {/* Dynamic Content */}
                {view === 'portfolio' ? (
                    <PortfolioOverview onSelectStock={handleSelectStock} />
                ) : (
                    <StockDashboard
                        initialStock={selectedStock}
                        onBack={handleBackToPortfolio}
                    />
                )}
            </div>
        </div>
    );
}
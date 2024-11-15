'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

// Dynamically import Plot with no SSR(Server Side Rendering)
const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
    loading: () => <div className="flex justify-center p-8"><CircularProgress /></div>
});

export default function PlotDisplay() {
    // Component States
    const [stockData, setStockData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sample data and utility functions
    const sampleTrace = {
        x: ['2017-01-04', '2017-01-05', '2017-01-06', '2017-01-09', '2017-01-10'],
        close: [116.019997, 116.610001, 117.910004, 118.989998, 119.110001],
        high: [116.510002, 116.860001, 118.160004, 119.43, 119.379997],
        low: [115.75, 115.809998, 116.470001, 117.940002, 118.300003],
        open: [115.849998, 115.919998, 116.779999, 117.949997, 118.769997],
        type: 'candlestick',
        increasing: { line: { color: '#17BECF' } },
        decreasing: { line: { color: '#7F7F7F' } },
    };

    const layout = {
        dragmode: 'zoom',
        margin: {
            r: 10,
            t: 25,
            b: 40,
            l: 60
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        xaxis: {
            gridcolor: '#E5E7EB',
            autorange: true,
            rangeslider: { visible: false },
            title: 'Date',
            type: 'date'
        },
        yaxis: {
            gridcolor: '#E5E7EB',
            autorange: true,
            type: 'linear'
        }
    };

    // Setup Component
    useEffect(() => {
        const loadData = async () => {
            try {
                // Simulated data loading
                // Replace this with your actual data fetching
                setTimeout(() => {
                    setStockData([sampleTrace]);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error loading data:', error);
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // UI View
    return (
        <div className="space-y-8">
            {/* Basic Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Simple Line and Bar Chart */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Basic Analytics</h3>
                    <Plot
                        data={[
                            {
                                x: [1, 2, 3],
                                y: [2, 6, 3],
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: '#8B5CF6' },
                            },
                            {
                                type: 'bar',
                                x: [1, 2, 3],
                                y: [2, 5, 3],
                                marker: { color: '#EC4899' }
                            },
                        ]}
                        layout={{
                            ...layout,
                            height: 400,
                        }}
                        config={{ responsive: true, displayModeBar: false }}
                        className="w-full"
                    />
                </div>

                {/* Candlestick Chart */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Stock Performance</h3>
                    <Plot
                        data={[sampleTrace]}
                        layout={{
                            ...layout,
                            height: 400,
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Full Width Chart */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4">Historical Data</h3>
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <CircularProgress />
                    </div>
                ) : stockData.length > 0 ? (
                    <Plot
                        data={stockData}
                        layout={{
                            ...layout,
                            height: 500,
                        }}
                        config={{ responsive: true }}
                        className="w-full"
                    />
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
}
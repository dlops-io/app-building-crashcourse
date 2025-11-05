'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataService from '@/lib/DataService';

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
});

export default function StockDashboard({ initialStock = 'AAPL', onBack }) {
    // Component States
    const [selectedStock, setSelectedStock] = useState(initialStock);
    const [stockData, setStockData] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [movingAverages, setMovingAverages] = useState(null);
    const [technicalIndicators, setTechnicalIndicators] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('90');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const stockList = DataService.GetStockList();

    // Detect theme
    useEffect(() => {
        const checkTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkTheme();

        // Watch for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Load data
    useEffect(() => {
        loadStockData();
    }, [selectedStock, timeRange]);

    const loadStockData = async () => {
        setIsLoading(true);
        try {
            const [stockRes, metricsRes, maRes, tiRes] = await Promise.all([
                DataService.GetStockData(selectedStock, parseInt(timeRange)),
                DataService.GetStockMetrics(selectedStock),
                DataService.GetMovingAverages(selectedStock),
                DataService.GetTechnicalIndicators(selectedStock)
            ]);

            setStockData(stockRes.data);
            setMetrics(metricsRes.data);
            setMovingAverages(maRes.data);
            setTechnicalIndicators(tiRes.data);
        } catch (error) {
            console.error('Error loading stock data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Theme-aware colors
    const colors = {
        text: isDarkMode ? '#e5e7eb' : '#1f2937',
        grid: isDarkMode ? '#374151' : '#e5e7eb',
        paper: 'rgba(0,0,0,0)',
        plot: 'rgba(0,0,0,0)',
        up: '#10b981',
        down: '#ef4444',
        volume: isDarkMode ? '#6366f1' : '#8b5cf6'
    };

    // Chart configurations
    const getBaseLayout = () => ({
        paper_bgcolor: colors.paper,
        plot_bgcolor: colors.plot,
        font: { color: colors.text, family: 'Inter, sans-serif', size: 12 },
        margin: { t: 30, r: 10, b: 40, l: 60 },
        xaxis: {
            gridcolor: colors.grid,
            color: colors.text,
            showgrid: true
        },
        yaxis: {
            gridcolor: colors.grid,
            color: colors.text,
            showgrid: true
        },
        hovermode: 'x unified'
    });

    // Format large numbers
    const formatNumber = (num) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    };

    const formatVolume = (num) => {
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
        return `${num.toLocaleString()}`;
    };

    // KPI Card Component
    const KpiCard = ({ title, value, change, icon: Icon, trend }) => (
        <div className="bg-card border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{title}</span>
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {Math.abs(trend).toFixed(2)}%
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {change && <div className="text-xs text-muted-foreground mt-1">{change}</div>}
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="bg-card border rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onBack}
                                className="hover:bg-accent"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                {stockList.find(s => s.symbol === selectedStock)?.name || selectedStock}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {stockList.find(s => s.symbol === selectedStock)?.sector} • Real-time Market Analysis
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Select value={selectedStock} onValueChange={setSelectedStock}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select stock" />
                            </SelectTrigger>
                            <SelectContent>
                                {stockList.map(stock => (
                                    <SelectItem key={stock.symbol} value={stock.symbol}>
                                        {stock.symbol} - {stock.name.split(' ')[0]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">1 Month</SelectItem>
                                <SelectItem value="90">3 Months</SelectItem>
                                <SelectItem value="180">6 Months</SelectItem>
                                <SelectItem value="365">1 Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Current Price"
                        value={`$${metrics.price.toFixed(2)}`}
                        change={`${metrics.change >= 0 ? '+' : ''}$${metrics.change.toFixed(2)} today`}
                        icon={DollarSign}
                        trend={metrics.changePercent}
                    />
                    <KpiCard
                        title="Market Cap"
                        value={formatNumber(metrics.marketCap)}
                        change={`Volume: ${formatVolume(metrics.volume)}`}
                        icon={BarChart3}
                    />
                    <KpiCard
                        title="P/E Ratio"
                        value={metrics.pe.toFixed(2)}
                        change={`Beta: ${metrics.beta.toFixed(2)}`}
                        icon={Activity}
                    />
                    <KpiCard
                        title="52-Week Range"
                        value={`$${metrics.low52Week} - $${metrics.high52Week}`}
                        change={`Dividend Yield: ${metrics.dividend}%`}
                        icon={Calendar}
                    />
                </div>
            )}

            {/* Main Price Chart */}
            <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Price Action & Volume</h3>
                <div className="space-y-4">
                    {/* Candlestick Chart */}
                    <Plot
                        data={[
                            {
                                x: stockData.map(d => d.date),
                                open: stockData.map(d => d.open),
                                high: stockData.map(d => d.high),
                                low: stockData.map(d => d.low),
                                close: stockData.map(d => d.close),
                                type: 'candlestick',
                                name: selectedStock,
                                increasing: { line: { color: colors.up } },
                                decreasing: { line: { color: colors.down } },
                                xaxis: 'x',
                                yaxis: 'y'
                            }
                        ]}
                        layout={{
                            ...getBaseLayout(),
                            height: 400,
                            xaxis: {
                                ...getBaseLayout().xaxis,
                                rangeslider: { visible: false },
                                type: 'date'
                            },
                            yaxis: {
                                ...getBaseLayout().yaxis,
                                title: { text: 'Price ($)', font: { color: colors.text } }
                            }
                        }}
                        config={{ responsive: true, displayModeBar: false }}
                        className="w-full"
                    />

                    {/* Volume Chart */}
                    <Plot
                        data={[
                            {
                                x: stockData.map(d => d.date),
                                y: stockData.map(d => d.volume),
                                type: 'bar',
                                name: 'Volume',
                                marker: {
                                    color: stockData.map(d => d.close >= d.open ? colors.up : colors.down)
                                }
                            }
                        ]}
                        layout={{
                            ...getBaseLayout(),
                            height: 150,
                            xaxis: {
                                ...getBaseLayout().xaxis,
                                type: 'date'
                            },
                            yaxis: {
                                ...getBaseLayout().yaxis,
                                title: { text: 'Volume', font: { color: colors.text } }
                            }
                        }}
                        config={{ responsive: true, displayModeBar: false }}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Technical Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Moving Averages */}
                <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Moving Averages</h3>
                    <Plot
                        data={[
                            {
                                x: stockData.map(d => d.date),
                                y: stockData.map(d => d.close),
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Close Price',
                                line: { color: colors.volume, width: 2 }
                            },
                            {
                                x: stockData.map(d => d.date),
                                y: stockData.map(() => movingAverages?.sma20),
                                type: 'scatter',
                                mode: 'lines',
                                name: 'SMA 20',
                                line: { color: '#f59e0b', width: 1, dash: 'dot' }
                            },
                            {
                                x: stockData.map(d => d.date),
                                y: stockData.map(() => movingAverages?.sma50),
                                type: 'scatter',
                                mode: 'lines',
                                name: 'SMA 50',
                                line: { color: '#3b82f6', width: 1, dash: 'dot' }
                            }
                        ]}
                        layout={{
                            ...getBaseLayout(),
                            height: 300,
                            showlegend: true,
                            legend: {
                                font: { color: colors.text },
                                bgcolor: 'rgba(0,0,0,0)',
                                orientation: 'h',
                                y: -0.2
                            },
                            xaxis: {
                                ...getBaseLayout().xaxis,
                                type: 'date'
                            }
                        }}
                        config={{ responsive: true, displayModeBar: false }}
                        className="w-full"
                    />
                </div>

                {/* Technical Indicators */}
                {technicalIndicators && (
                    <div className="bg-card border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Technical Indicators</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium text-foreground">RSI (14)</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${technicalIndicators.rsi > 70 ? 'text-red-500' : technicalIndicators.rsi < 30 ? 'text-green-500' : 'text-foreground'}`}>
                                        {technicalIndicators.rsi.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {technicalIndicators.rsi > 70 ? 'Overbought' : technicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium text-foreground">MACD</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-foreground">{technicalIndicators.macd.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground">Signal: {technicalIndicators.signal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <div className="text-sm font-medium text-foreground mb-2">Bollinger Bands</div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Upper:</span>
                                        <span className="font-mono text-foreground">${technicalIndicators.bollingerUpper.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Middle:</span>
                                        <span className="font-mono text-foreground">${technicalIndicators.bollingerMiddle.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Lower:</span>
                                        <span className="font-mono text-foreground">${technicalIndicators.bollingerLower.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {movingAverages && (
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="text-sm font-medium text-foreground mb-2">Moving Averages</div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">SMA 20:</span>
                                            <span className="font-mono text-foreground ml-1">${movingAverages.sma20.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">EMA 12:</span>
                                            <span className="font-mono text-foreground ml-1">${movingAverages.ema12.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">SMA 50:</span>
                                            <span className="font-mono text-foreground ml-1">${movingAverages.sma50.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">EMA 26:</span>
                                            <span className="font-mono text-foreground ml-1">${movingAverages.ema26.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

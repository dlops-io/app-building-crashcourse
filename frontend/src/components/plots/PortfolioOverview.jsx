'use client'

import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, TrendingDown, ArrowRight, DollarSign, PieChart, BarChart3, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataService from '@/lib/DataService';

export default function PortfolioOverview({ onSelectStock }) {
    const [portfolioData, setPortfolioData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioMetrics, setPortfolioMetrics] = useState(null);

    const stockList = DataService.GetStockList();

    useEffect(() => {
        loadPortfolioData();
    }, []);

    const loadPortfolioData = async () => {
        setIsLoading(true);
        try {
            // Load metrics for all stocks
            const metricsPromises = stockList.map(stock =>
                DataService.GetStockMetrics(stock.symbol)
            );
            const results = await Promise.all(metricsPromises);

            const data = stockList.map((stock, index) => ({
                ...stock,
                metrics: results[index].data
            }));

            setPortfolioData(data);

            // Calculate portfolio totals
            const totalValue = data.reduce((sum, stock) => sum + stock.metrics.marketCap, 0);
            const avgChange = data.reduce((sum, stock) => sum + stock.metrics.changePercent, 0) / data.length;
            const gainers = data.filter(stock => stock.metrics.changePercent > 0).length;
            const losers = data.filter(stock => stock.metrics.changePercent < 0).length;

            setPortfolioMetrics({
                totalValue,
                avgChange,
                gainers,
                losers,
                totalStocks: data.length
            });
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        return `$${num.toFixed(2)}`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Portfolio Summary Cards */}
            {portfolioMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card border rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">Portfolio Value</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {formatNumber(portfolioMetrics.totalValue)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Across {portfolioMetrics.totalStocks} holdings
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">Avg Daily Change</span>
                        </div>
                        <div className={`text-2xl font-bold ${portfolioMetrics.avgChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {portfolioMetrics.avgChange >= 0 ? '+' : ''}{portfolioMetrics.avgChange.toFixed(2)}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            {portfolioMetrics.avgChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            Market trend
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm text-muted-foreground">Top Performers</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {portfolioMetrics.gainers}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Stocks with gains today
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <span className="text-sm text-muted-foreground">Underperformers</span>
                        </div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {portfolioMetrics.losers}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Stocks with losses today
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Table */}
            <div className="bg-card border rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-foreground">Portfolio Holdings</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Click on any stock to view detailed analysis
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Symbol</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Sector</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Price</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Change</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Change %</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Market Cap</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground">P/E</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {portfolioData.map((stock) => (
                                <tr
                                    key={stock.symbol}
                                    className="hover:bg-accent/50 transition-colors cursor-pointer"
                                    onClick={() => onSelectStock(stock.symbol)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">
                                                    {stock.symbol.substring(0, 2)}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-foreground">{stock.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-foreground">{stock.name}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                            {stock.sector}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-sm font-medium text-foreground">
                                            ${stock.metrics.price.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`text-sm font-medium ${
                                            stock.metrics.change >= 0
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {stock.metrics.change >= 0 ? '+' : ''}${stock.metrics.change.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {stock.metrics.changePercent >= 0 ? (
                                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            )}
                                            <span className={`text-sm font-medium ${
                                                stock.metrics.changePercent >= 0
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {stock.metrics.changePercent >= 0 ? '+' : ''}{stock.metrics.changePercent.toFixed(2)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-sm text-muted-foreground">
                                            {formatNumber(stock.metrics.marketCap)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-sm text-muted-foreground">
                                            {stock.metrics.pe.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectStock(stock.symbol);
                                            }}
                                        >
                                            <span className="text-xs mr-1">Analyze</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sector Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Sector Distribution</h3>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(
                            portfolioData.reduce((acc, stock) => {
                                acc[stock.sector] = (acc[stock.sector] || 0) + 1;
                                return acc;
                            }, {})
                        ).map(([sector, count]) => {
                            const percentage = (count / portfolioData.length) * 100;
                            return (
                                <div key={sector}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-foreground">{sector}</span>
                                        <span className="text-muted-foreground">{count} stocks ({percentage.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary rounded-full h-2 transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Performance Summary</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-foreground">Best Performer</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-green-600 dark:text-green-400">
                                    {[...portfolioData].sort((a, b) => b.metrics.changePercent - a.metrics.changePercent)[0]?.symbol}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    +{[...portfolioData].sort((a, b) => b.metrics.changePercent - a.metrics.changePercent)[0]?.metrics.changePercent.toFixed(2)}%
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                                <span className="text-sm font-medium text-foreground">Worst Performer</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-red-600 dark:text-red-400">
                                    {[...portfolioData].sort((a, b) => a.metrics.changePercent - b.metrics.changePercent)[0]?.symbol}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {[...portfolioData].sort((a, b) => a.metrics.changePercent - b.metrics.changePercent)[0]?.metrics.changePercent.toFixed(2)}%
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium text-foreground">Highest P/E Ratio</span>
                            <div className="text-right">
                                <div className="text-sm font-bold text-foreground">
                                    {[...portfolioData].sort((a, b) => b.metrics.pe - a.metrics.pe)[0]?.symbol}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {[...portfolioData].sort((a, b) => b.metrics.pe - a.metrics.pe)[0]?.metrics.pe.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium text-foreground">Largest Market Cap</span>
                            <div className="text-right">
                                <div className="text-sm font-bold text-foreground">
                                    {[...portfolioData].sort((a, b) => b.metrics.marketCap - a.metrics.marketCap)[0]?.symbol}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatNumber([...portfolioData].sort((a, b) => b.metrics.marketCap - a.metrics.marketCap)[0]?.metrics.marketCap)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { List, BarChart, Grid3x3, Bot, Image, Mic, Mic2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
    const features = [
        {
            name: 'Todo Manager',
            description: 'Organize your tasks efficiently with an intuitive todo list. Add, edit, and track your daily tasks.',
            icon: List,
            href: '/todo',
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            name: 'Image Classification',
            description: 'Upload images and get instant AI-powered classification. Identify objects, scenes, and more.',
            icon: Image,
            href: '/image',
            color: 'text-pink-600 dark:text-pink-400'
        },
        {
            name: 'Audio to Text',
            description: 'Convert audio recordings to text with high accuracy. Transcribe meetings, lectures, and interviews.',
            icon: Mic,
            href: '/audio',
            color: 'text-orange-600 dark:text-orange-400'
        },
        {
            name: 'Text to Audio',
            description: 'Transform written text into natural-sounding speech. Generate audio from any text content.',
            icon: Mic2,
            href: '/text',
            color: 'text-teal-600 dark:text-teal-400'
        },
        {
            name: 'Style Transfer',
            description: 'Transform your images with AI-powered style transfer. Apply artistic styles to your photos.',
            icon: Grid3x3,
            href: '/styletransfer',
            color: 'text-purple-600 dark:text-purple-400'
        },
        {
            name: 'Data Visualization',
            description: 'Create beautiful interactive charts and plots. Visualize your data with powerful plotting tools.',
            icon: BarChart,
            href: '/plots',
            color: 'text-green-600 dark:text-green-400'
        },
        {
            name: 'Property Finder',
            description: 'Explore real estate listings on an interactive map. Filter properties by type, price, and bedrooms.',
            icon: MapPin,
            href: '/map',
            color: 'text-red-600 dark:text-red-400'
        },
        {
            name: 'AI Assistant',
            description: 'Chat with our intelligent AI assistant. Get answers, insights, and help with various tasks.',
            icon: Bot,
            href: '/chat',
            color: 'text-indigo-600 dark:text-indigo-400'
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
                        Welcome to{' '}
                        <span className="text-primary">AC215 Awesome App</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Your all-in-one platform for productivity, AI tools, and creative applications.
                        Explore powerful features designed to enhance your workflow.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="text-base px-8">
                            Get Started
                        </Button>
                        <Button size="lg" variant="outline" className="text-base px-8">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Explore Our Features</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover a suite of powerful tools designed to boost your productivity and creativity
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Link key={feature.name} href={feature.href}>
                                    <div className="group h-full bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 ${feature.color}`}>
                                                <Icon className="h-8 w-8" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                    {feature.name}
                                                </h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
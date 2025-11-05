'use client'

import { useEffect, useState, useRef } from 'react';
import { Brush, Image, RefreshCw } from 'lucide-react';
import DataService from '@/lib/DataService';

export default function StyleTransfer() {
    // Component States
    const [numImages] = useState(12);
    const [contentImages, setContentImages] = useState([]);
    const [styleImages, setStyleImages] = useState([]);
    const [selectedContentImage, setSelectedContentImage] = useState(null);
    const [selectedStyleImage, setSelectedStyleImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [stylizedImageUrl, setStylizedImageUrl] = useState(null);
    const canvasRef = useRef(null);

    // Setup Component
    useEffect(() => {
        loadContentImages();
        loadStyleImages();
    }, []);
    useEffect(() => {
        applyStyleTransfer();
    }, [selectedContentImage, selectedStyleImage]);

    // Handlers
    const loadContentImages = async () => {
        try {
            const response = await DataService.StyleTransferGetContentImages();
            setContentImages(shuffle(response.data));
        } catch (error) {
            console.error('Error loading content images:', error);
        }
    };

    const loadStyleImages = async () => {
        try {
            const response = await DataService.StyleTransferGetStyleImages();
            setStyleImages(shuffle(response.data));
        } catch (error) {
            console.error('Error loading style images:', error);
        }
    };

    const applyStyleTransfer = async () => {
        if (!selectedStyleImage || !selectedContentImage) return;

        setIsLoading(true);
        setPrediction(null);

        try {
            const response = await DataService.StyleTransferApplyStyleTransfer(
                selectedStyleImage,
                selectedContentImage
            );
            setPrediction(response.data);
        } catch (error) {
            console.error('Error applying style transfer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const shuffle = (data) => {
        return data
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
            .slice(0, numImages);
    };

    // UI View
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Style Images Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2 font-montserrat">
                        <Brush className="text-purple-500 h-5 w-5" />
                        Artworks
                    </h2>
                    <button
                        onClick={loadStyleImages}
                        className="p-2 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {styleImages.map((img, index) => (
                        <button
                            key={img}
                            onClick={() => setSelectedStyleImage(img)}
                            className={`relative aspect-square overflow-hidden rounded-lg ${selectedStyleImage === img
                                ? 'ring-4 ring-purple-500'
                                : 'hover:opacity-90'
                                } transition-all`}
                        >
                            <img
                                src={DataService.StyleTransferGetImage(img)}
                                alt={`Style ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center font-montserrat">Result</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden aspect-square">
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                        </div>
                    ) : prediction ? (
                        <img
                            src={DataService.StyleTransferGetImage(prediction.stylized_image)}
                            alt="Stylized result"
                            className="w-full h-full object-cover"
                        />
                    ) : selectedContentImage && selectedStyleImage ? (
                        <img
                            src={DataService.StyleTransferGetImage(selectedContentImage)}
                            alt="Selected content"
                            className="w-full h-full object-cover opacity-50"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 text-center text-gray-500 dark:text-gray-400">
                            Select an artwork and photo to begin
                        </div>
                    )}
                </div>
            </div>

            {/* Content Images Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2 font-montserrat">
                        <Image className="text-purple-500 h-5 w-5" />
                        Photos
                    </h2>
                    <button
                        onClick={loadContentImages}
                        className="p-2 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {contentImages.map((img, index) => (
                        <button
                            key={img}
                            onClick={() => setSelectedContentImage(img)}
                            className={`relative aspect-square overflow-hidden rounded-lg ${selectedContentImage === img
                                ? 'ring-4 ring-purple-500'
                                : 'hover:opacity-90'
                                } transition-all`}
                        >
                            <img
                                src={DataService.StyleTransferGetImage(img)}
                                alt={`Content ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
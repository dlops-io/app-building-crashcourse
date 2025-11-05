'use client'

import { useState } from 'react';
import { Mic2, Play, History } from 'lucide-react';
import DataService from '@/lib/DataService';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Text2Audio() {
    // Component States
    const [text, setText] = useState('');
    const [outputs, setOutputs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Handlers
    const handleSynthesis = async () => {
        if (!text.trim()) return;

        setIsLoading(true);
        try {
            const response = await DataService.Text2Audio({ text: text.trim() });
            setOutputs(prevOutputs => [response.data, ...prevOutputs]);
            setText(''); // Clear input after successful conversion
        } catch (error) {
            console.error('Synthesis error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // UI View
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Input Section */}
            <div className="md:col-span-5">
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Enter Text
                        </h3>
                        <div className="space-y-4">
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type or paste your text here..."
                                className="h-40 resize-none"
                            />
                            <Button
                                onClick={handleSynthesis}
                                disabled={!text.trim() || isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                            >
                                <Mic2 className="h-5 w-5 mr-2" />
                                {isLoading ? 'Converting...' : 'Convert to Speech'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Output Section */}
            <div className="md:col-span-7">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <History className="text-purple-500 h-5 w-5" />
                            Generated Audio
                        </h3>
                    </div>

                    {outputs.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {outputs.map((output, idx) => (
                                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-grow">
                                            <p className="text-gray-600 text-sm mb-2">
                                                {output.text}
                                            </p>
                                            <audio
                                                controls
                                                className="w-full"
                                                src={DataService.Text2AudioGetAudio(output.audio_path)}
                                            >
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                        <button
                                            className="p-2 text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
                                            title="Play Audio"
                                        >
                                            <Play className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No audio generated yet. Enter some text to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
'use client'

import { useState } from 'react';
import { RecordVoiceOver, PlayArrow, History } from '@mui/icons-material';
import DataService from '@/services/DataService';

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
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type or paste your text here..."
                                className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            />
                            <button
                                onClick={handleSynthesis}
                                disabled={!text.trim() || isLoading}
                                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${text.trim() && !isLoading
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    } transition-all duration-200`}
                            >
                                <RecordVoiceOver />
                                {isLoading ? 'Converting...' : 'Convert to Speech'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Output Section */}
            <div className="md:col-span-7">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <History className="text-purple-500" />
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
                                            <PlayArrow />
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
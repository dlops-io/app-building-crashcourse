'use client'

import { useEffect, useState } from 'react';
import { Mic, Square, AlertTriangle } from 'lucide-react';
import MicRecorder from 'mic-recorder-to-mp3';
import DataService from '@/lib/DataService';

// Initialize recorder outside component to persist between renders
const recorder = new MicRecorder({
    bitRate: 128
});

export default function Audio2Text() {
    // Component States
    const [isRecording, setIsRecording] = useState(false);
    const [blobURL, setBlobURL] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcriptionResults, setTranscriptionResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Setup Component
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                console.log('Permission Granted');
                setIsBlocked(false);
            })
            .catch(() => {
                console.log('Permission Denied');
                setIsBlocked(true);
            });
    }, []);

    // Handlers
    const handleStartRecording = () => {
        if (isBlocked) {
            console.log('Permission Denied');
            return;
        }

        recorder
            .start()
            .then(() => {
                setIsRecording(true);
            })
            .catch((e) => console.error(e));
    };
    const handleStopRecording = async () => {
        try {
            const [buffer, blob] = await recorder.stop().getMp3();
            setBlobURL(URL.createObjectURL(blob));
            setIsRecording(false);
            setAudioBlob(blob);
            setIsLoading(true);

            const formData = new FormData();
            formData.append("file", blob);
            const response = await DataService.Audio2Text(formData);
            setTranscriptionResults(response.data);
        } catch (error) {
            console.error('Recording error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // UI View
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Recording Section */}
            <div className="md:col-span-4">
                <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                    {/* Audio Player */}
                    <div className="p-6 flex justify-center">
                        {blobURL ? (
                            <audio
                                src={blobURL}
                                controls
                                className="w-full"
                            />
                        ) : (
                            <div className="text-muted-foreground text-center py-4">
                                No recording yet
                            </div>
                        )}
                    </div>

                    {/* Recording Controls */}
                    <div className="border-t border-border p-6">
                        {isBlocked ? (
                            <div className="flex items-center justify-center text-yellow-500 gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Microphone access denied</span>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <button
                                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                                    className={`p-4 rounded-full transition-all ${isRecording
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-primary hover:bg-primary/90'
                                        }`}
                                >
                                    {isRecording ? (
                                        <Square className="w-8 h-8 text-white" />
                                    ) : (
                                        <Mic className="w-8 h-8 text-primary-foreground" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transcription Results */}
            <div className="md:col-span-8">
                <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-lg font-semibold text-foreground">
                            Transcription Results
                        </h3>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Processing audio...</p>
                        </div>
                    ) : transcriptionResults.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Transcription
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Confidence
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">
                                    {transcriptionResults.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-pre-wrap text-sm text-foreground">
                                                {item.transcript}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {(item.confidence * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            No transcriptions yet. Record some audio to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
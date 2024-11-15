'use client'

import { useEffect, useState } from 'react';
import { Mic, Stop, Warning } from '@mui/icons-material';
import MicRecorder from 'mic-recorder-to-mp3';
import DataService from '@/services/DataService';

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
                <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                    {/* Audio Player */}
                    <div className="p-6 flex justify-center">
                        {blobURL ? (
                            <audio
                                src={blobURL}
                                controls
                                className="w-full"
                            />
                        ) : (
                            <div className="text-gray-400 text-center py-4">
                                No recording yet
                            </div>
                        )}
                    </div>

                    {/* Recording Controls */}
                    <div className="border-t border-gray-800 p-6">
                        {isBlocked ? (
                            <div className="flex items-center justify-center text-yellow-500 gap-2">
                                <Warning />
                                <span>Microphone access denied</span>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <button
                                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                                    className={`p-4 rounded-full transition-all ${isRecording
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-purple-500 hover:bg-purple-600'
                                        }`}
                                >
                                    {isRecording ? (
                                        <Stop className="w-8 h-8 text-white" />
                                    ) : (
                                        <Mic className="w-8 h-8 text-white" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transcription Results */}
            <div className="md:col-span-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Transcription Results
                        </h3>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                            <p className="mt-4 text-gray-600">Processing audio...</p>
                        </div>
                    ) : transcriptionResults.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transcription
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Confidence
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transcriptionResults.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">
                                                {item.transcript}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {(item.confidence * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No transcriptions yet. Record some audio to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
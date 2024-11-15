'use client'

import { useRef, useState } from 'react';
import {
    CloudUpload,
    CameraAlt
} from '@mui/icons-material';
import DataService from '@/services/DataService';

export default function ImageClassification() {
    // Component States
    const inputFile = useRef(null);
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handlers
    const handleImageUploadClick = () => {
        inputFile.current.click();
    };
    const handleOnChange = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            setImage(URL.createObjectURL(file));
            setIsLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const response = await DataService.ImageClassificationPredict(formData);
            setPrediction(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // UI View
    return (
        <div className="space-y-6">
            {/* Results Table */}
            {prediction && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Index
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Probability
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prediction.results?.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.class_index}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.class_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(item.probability * 100).toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Image Upload Area */}
            <div
                onClick={handleImageUploadClick}
                className={`
                    relative cursor-pointer
                    border-2 border-dashed border-gray-300 rounded-lg
                    bg-gray-50 hover:bg-gray-100 transition-colors
                    min-h-[400px] flex flex-col items-center justify-center
                    ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                `}
            >
                <input
                    type="file"
                    accept="image/*"
                    capture="camera"
                    className="hidden"
                    ref={inputFile}
                    onChange={handleOnChange}
                />

                {image ? (
                    <div className="w-full h-full p-4">
                        <img
                            src={image}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                ) : (
                    <div className="text-center p-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-purple-100 rounded-full">
                                <CloudUpload className="text-purple-500 w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-700 font-semibold">
                                    Click to upload an image
                                </p>
                                <p className="text-sm text-gray-500">
                                    or drag and drop
                                </p>
                            </div>
                            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors">
                                <CameraAlt className="w-5 h-5" />
                                Take Photo
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {/* Debug Output */}
            {prediction && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-mono text-gray-600 overflow-x-auto">
                        {JSON.stringify(prediction, null, 2)}
                    </p>
                </div>
            )}
        </div>
    );
}
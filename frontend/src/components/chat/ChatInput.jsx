'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, CameraAltOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

export default function ChatInput({
    onSendMessage,
    selectedModel,
    onModelChange,
    disableModelSelect = false
}) {
    // Component States
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const textAreaRef = useRef(null);
    const fileInputRef = useRef(null);

    const adjustTextAreaHeight = () => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // Setup Component
    useEffect(() => {
        adjustTextAreaHeight();
    }, [message]);

    // Handlers
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift + Enter: add new line
                return;
            } else {
                // Enter only: submit
                e.preventDefault();
                handleSubmit();
            }
        }
    };
    const handleSubmit = () => {

        if (message.trim() || selectedImage) {
            console.log('Submitting message:', message);
            const newMessage = {
                content: message.trim(),
                image: selectedImage?.preview || null
            };

            // Send the message
            onSendMessage(newMessage);

            // Reset
            setMessage('');
            setSelectedImage(null);
            if (textAreaRef.current) {
                textAreaRef.current.style.height = 'auto';
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert('File size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage({
                    file: file,
                    preview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleModelChange = (event) => {
        onModelChange(event.target.value);
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // UI View
    return (
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
            {selectedImage && (
                <div className="relative inline-block mb-4">
                    <img
                        src={selectedImage.preview}
                        alt="Preview"
                        className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full 
                                 flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="relative mb-4">
                <textarea
                    ref={textAreaRef}
                    className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 pr-12 text-gray-800 
                             placeholder-gray-500 focus:ring-2 focus:ring-purple-500 min-h-[24px] 
                             max-h-[400px] resize-none overflow-hidden leading-relaxed"
                    placeholder="How can AI Assistant help you today?"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyPress}
                    rows={1}
                />
                <button
                    className={`absolute right-2 bottom-2 p-2 rounded-full transition-all
                              ${message.trim() || selectedImage
                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    onClick={handleSubmit}
                    disabled={!message.trim() && !selectedImage}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <IconButton
                        onClick={handleImageClick}
                        className="text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <CameraAltOutlined />
                    </IconButton>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        Use shift + return for new line
                    </span>
                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={selectedModel}
                        onChange={handleModelChange}
                        disabled={disableModelSelect}
                    >
                        <option value="llm">AI Assistant (LLM)</option>
                        <option value="llm-cnn">AI Assistant (LLM + CNN)</option>
                        <option value="llm-rag">AI Expert (RAG)</option>
                        <option value="llm-agent">AI Expert (Agent)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
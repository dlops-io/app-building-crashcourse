'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
        <div className="bg-card/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-border">
            {selectedImage && (
                <div className="relative inline-block mb-4">
                    <img
                        src={selectedImage.preview}
                        alt="Preview"
                        className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full
                                 flex items-center justify-center hover:bg-foreground/80 transition-colors"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="relative mb-4">
                <Textarea
                    ref={textAreaRef}
                    className="w-full min-h-[56px] max-h-[400px] pr-12 resize-none"
                    placeholder="How can AI Assistant help you today?"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyPress}
                    rows={1}
                />
                <Button
                    size="icon"
                    className={`absolute right-2 bottom-2 rounded-full transition-all
                              ${message.trim() || selectedImage
                            ? 'bg-primary text-primary-foreground hover:shadow-lg'
                            : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleSubmit}
                    disabled={!message.trim() && !selectedImage}
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-4">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <Button
                        onClick={handleImageClick}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-accent"
                    >
                        <Camera className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        Use shift + return for new line
                    </span>
                    <select
                        className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground
                                 focus:ring-2 focus:ring-ring focus:border-transparent"
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
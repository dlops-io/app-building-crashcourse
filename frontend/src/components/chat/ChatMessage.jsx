'use client';

import { useState, useRef, useEffect } from 'react';
import { Person, SmartToy, Forum, RemoveRedEye } from '@mui/icons-material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
//import DataService from "../../services/MockDataService"; // Mock
import DataService from "../../services/DataService";


export default function ChatMessage({
    chat,
    isTyping,
    model
}) {
    // Component States
    const chatHistoryRef = useRef(null);

    const fetchChat = async (id) => {
        try {
            setChat(null);
            const response = await DataService.GetChat(model, id);
            setChat(response.data);
            console.log(chat);
        } catch (error) {
            console.error('Error fetching chat:', error);
            setChat(null);
        }
    };

    // Setup Component
    // Auto-scroll to bottom of chat history when new messages are added
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chat, isTyping]);

    // Helper function to format time
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // UI View
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {chat && (
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                    <Forum className="text-purple-600" />
                    <h1 className="text-gray-800 font-medium">{chat.title}</h1>
                </div>
            )}

            <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat?.messages.map((msg) => (
                    <div
                        key={msg.message_id}
                        className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
                    >
                        <div className={`p-2 rounded-full ${msg.role === 'assistant' ? 'bg-purple-100' :
                            msg.role === 'cnn' ? 'bg-pink-100' : 'bg-gray-100'
                            }`}>
                            {msg.role === 'assistant' && <SmartToy className="text-purple-600" />}
                            {msg.role === 'cnn' && <RemoveRedEye className="text-pink-600" />}
                            {msg.role === 'user' && <Person className="text-gray-600" />}
                        </div>

                        <div className={`rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                            : 'bg-white text-gray-800'
                            }`}>
                            {msg.image && (
                                <img src={msg.image} alt="Chat" className="max-w-md rounded-lg mb-2" />
                            )}
                            {msg.image_path && (
                                <img
                                    src={DataService.GetChatMessageImage(model, msg.image_path)}
                                    alt="Chat"
                                    className="max-w-md rounded-lg mb-2"
                                />
                            )}

                            <div className={`prose ${msg.role === 'user' ? 'prose-invert' : ''} max-w-none`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>

                            {msg.results && (
                                <div className="mt-2 text-sm">
                                    {msg.results.prediction_label}&nbsp;
                                    ({msg.results.accuracy}%)
                                </div>
                            )}

                            {msg.timestamp && (
                                <div className="mt-2 text-xs opacity-60">
                                    {formatTime(msg.timestamp)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-center p-4">
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

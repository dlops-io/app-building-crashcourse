'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Bot, MessageSquare, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ScrollArea } from '@/components/ui/scroll-area';
//import DataService from "../../services/MockDataService"; // Mock
import DataService from "../../lib/DataService";


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
                <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
                    <MessageSquare className="text-primary h-5 w-5" />
                    <h1 className="text-foreground font-medium">{chat.title}</h1>
                </div>
            )}

            <ScrollArea className="flex-1 p-4">
                <div ref={chatHistoryRef} className="space-y-4">
                {chat?.messages.map((msg) => (
                    <div
                        key={msg.message_id}
                        className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
                    >
                        <div className={`p-2 rounded-full ${msg.role === 'assistant' ? 'bg-primary/10' :
                            msg.role === 'cnn' ? 'bg-pink-500/10 dark:bg-pink-400/10' : 'bg-muted'
                            }`}>
                            {msg.role === 'assistant' && <Bot className="text-primary h-5 w-5" />}
                            {msg.role === 'cnn' && <Eye className="text-pink-600 dark:text-pink-400 h-5 w-5" />}
                            {msg.role === 'user' && <User className="text-muted-foreground h-5 w-5" />}
                        </div>

                        <div className={`rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-foreground border border-border'
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

                            <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none`}>
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
                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, History } from 'lucide-react';
import DataService from "../../lib/DataService";
import { formatRelativeTime } from "../../lib/Common";


export default function ChatHistorySidebar({
    chat_id,
    model
}) {
    // Component States
    const [chatHistory, setChatHistory] = useState([]);
    const router = useRouter();

    // Setup Component
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await DataService.GetChats(model, 20);
                setChatHistory(response.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
                setChatHistory([]); // Set empty array in case of error
            }
        };

        fetchData();
    }, []);

    // UI View
    return (
        <div className="flex flex-col h-full bg-card border-r border-border">
            <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
                <h2 className="text-foreground text-lg flex items-center gap-2">
                    <History className="text-primary w-5 h-5" />
                    Chat History
                </h2>
                <button
                    onClick={() => router.push(`/chat?model=${model}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90
                        rounded-lg transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {chatHistory.map((chat) => (
                    <div
                        key={chat.chat_id}
                        onClick={() => router.push(`/chat?model=${model}&id=${chat.chat_id}`)}
                        className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50
                          transition-colors ${chat_id === chat.chat_id ? 'bg-accent' : ''}`}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-foreground text-sm line-clamp-2">
                                {chat.title}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {formatRelativeTime(chat.dts)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
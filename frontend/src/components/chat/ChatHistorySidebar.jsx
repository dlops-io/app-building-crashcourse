'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Add, History } from '@mui/icons-material';
import DataService from "../../services/DataService";
import { formatRelativeTime } from "../../services/Common";


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
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                <h2 className="text-white/90 text-lg flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Chat History
                </h2>
                <button
                    onClick={() => router.push(`/chat?model=${model}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 
                        text-white rounded-lg transition-colors"
                >
                    <Add className="w-4 h-4" />
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {chatHistory.map((chat) => (
                    <div
                        key={chat.chat_id}
                        onClick={() => router.push(`/chat?model=${model}&id=${chat.chat_id}`)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50
                          transition-colors ${chat_id === chat.chat_id ? 'bg-purple-50' : ''}`}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-800 text-sm line-clamp-2">
                                {chat.title}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {formatRelativeTime(chat.dts)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
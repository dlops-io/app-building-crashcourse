'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, History } from 'lucide-react';
//import DataService from "../../services/MockDataService"; // Mock
import DataService from "../../lib/DataService";
import { formatRelativeTime, MOCK_SERVICE } from "../../lib/Common";


export default function ChatHistory({
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
    }, [model]);

    // UI View
    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-3 text-foreground text-xl font-semibold">
                    <History className="text-primary h-6 w-6" />
                    Your recent chats
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors">
                    View all
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chatHistory.map((chat) => (
                    <Link
                        key={chat.chat_id}
                        href={`/chat?model=${model}&id=${chat.chat_id}`}
                        className="block"
                    >
                        <div
                            className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
                        >
                            <h3 className="text-foreground font-medium mb-2 line-clamp-2">
                                {chat.title}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {formatRelativeTime(chat.dts)}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
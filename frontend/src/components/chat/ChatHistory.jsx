'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowForward } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
//import DataService from "../../services/MockDataService"; // Mock
import DataService from "../../services/DataService";
import { formatRelativeTime, MOCK_SERVICE } from "../../services/Common";


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
                <h2 className="flex items-center gap-3 text-gray-800 text-xl font-semibold">
                    <HistoryIcon className="text-purple-600" />
                    Your recent chats
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    View all
                    <ArrowForward className="w-4 h-4" />
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
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                        >
                            <h3 className="text-gray-800 font-medium mb-2 line-clamp-2">
                                {chat.title}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {formatRelativeTime(chat.dts)}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
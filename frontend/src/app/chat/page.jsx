'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInput from '@/components/chat/ChatInput';
import ChatHistory from '@/components/chat/ChatHistory';
import ChatHistorySidebar from '@/components/chat/ChatHistorySidebar';
import ChatMessage from '@/components/chat/ChatMessage';
import DataService from "../../services/DataService";
import { uuid } from "../../services/Common";


export default function ChatPage({ searchParams }) {
    const params = use(searchParams);
    const chat_id = params.id;
    const model = params.model || 'llm';
    console.log(chat_id, model);

    // Component States
    const [chatId, setChatId] = useState(params.id);
    const [hasActiveChat, setHasActiveChat] = useState(false);
    const [chat, setChat] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedModel, setSelectedModel] = useState(model);
    const router = useRouter();

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
    useEffect(() => {
        if (chat_id) {
            fetchChat(chat_id);
            setHasActiveChat(true);
        } else {
            setChat(null);
            setHasActiveChat(false);
        }
    }, [chat_id]);
    useEffect(() => {
        setSelectedModel(model);
    }, [model]);

    function tempChatMessage(message) {
        // Set temp values
        message["message_id"] = uuid();
        message["role"] = 'user';
        if (chat) {
            // Append message
            var temp_chat = { ...chat };
            temp_chat["messages"].push(message);
        } else {
            var temp_chat = {
                "messages": [message]
            }
            return temp_chat;
        }
    }

    // Handlers
    const newChat = (message) => {
        console.log(message);
        // Start a new chat and submit to LLM
        const startChat = async (message) => {
            try {
                // Show typing indicator
                setIsTyping(true);
                setHasActiveChat(true);
                setChat(tempChatMessage(message)); // Show the user input message while LLM is invoked

                // Submit chat
                const response = await DataService.StartChatWithLLM(model, message);
                console.log(response.data);

                // Hide typing indicator and add response
                setIsTyping(false);

                setChat(response.data);
                setChatId(response.data["chat_id"]);
                router.push('/chat?model=' + selectedModel + '&id=' + response.data["chat_id"]);
            } catch (error) {
                console.error('Error fetching chat:', error);
                setIsTyping(false);
                setChat(null);
                setChatId(null);
                setHasActiveChat(false);
                router.push('/chat?model=' + selectedModel)
            }
        };
        startChat(message);

    };
    const appendChat = (message) => {
        console.log(message);
        // Append message and submit to LLM

        const continueChat = async (id, message) => {
            try {
                // Show typing indicator
                setIsTyping(true);
                setHasActiveChat(true);
                tempChatMessage(message);

                // Submit chat
                const response = await DataService.ContinueChatWithLLM(model, id, message);
                console.log(response.data);

                // Hide typing indicator and add response
                setIsTyping(false);

                setChat(response.data);
                forceRefresh();
            } catch (error) {
                console.error('Error fetching chat:', error);
                setIsTyping(false);
                setChat(null);
                setHasActiveChat(false);
            }
        };
        continueChat(chat_id, message);
    };
    // Force re-render by updating the key
    const forceRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };
    const handleModelChange = (newValue) => {

        setSelectedModel(newValue);
        var path = '/chat?model=' + newValue;
        if (chat_id) {
            path = path + '&id=' + chat_id;
        }
        router.push(path)
    };

    return (
        <div className="h-screen flex flex-col pt-16">
            {!hasActiveChat ? (
                <>
                    {/* Hero Section */}
                    <section className="flex-shrink-0 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-orange-400/10" />
                        <div className="container mx-auto px-4 max-w-3xl relative z-10 pt-20">
                            <div className="text-center">
                                <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
                                    AI Assistant 🌟
                                </h1>
                                <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
                                    <ChatInput
                                        onSendMessage={newChat}
                                        selectedModel={selectedModel}
                                        onModelChange={handleModelChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Chat History Section */}
                    <div className="flex-1 container mx-auto px-4 py-12 overflow-auto z-10">
                        <ChatHistory model={model} />
                    </div>
                </>
            ) : (
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Sidebar */}
                    <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200">
                        <ChatHistorySidebar chat_id={chat_id} model={model} />
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            <ChatMessage
                                chat={chat}
                                key={refreshKey}
                                isTyping={isTyping}
                                model={model}
                            />
                        </div>
                        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                            <ChatInput
                                onSendMessage={appendChat}
                                chat={chat}
                                selectedModel={selectedModel}
                                onModelChange={setSelectedModel}
                                disableModelSelect={true}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
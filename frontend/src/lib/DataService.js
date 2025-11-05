import { BASE_API_URL, uuid } from "./Common";
import { mockChats } from "./SampleData";
import axios from 'axios';

console.log("BASE_API_URL:", BASE_API_URL)

// Create an axios instance with base configuration
const api = axios.create({
    baseURL: BASE_API_URL
});

const DataService = {
    Init: function () {
        // Any application initialization logic comes here
    },
    ImageClassificationPredict: async function (formData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock response data
        const mockResults = {
            success: true,
            model: "MockNet v1.0",
            timestamp: new Date().toISOString(),
            results: [
                {
                    class_index: 1,
                    class_name: "Golden Retriever",
                    probability: 0.92
                },
                {
                    class_index: 2,
                    class_name: "Labrador",
                    probability: 0.85
                },
                {
                    class_index: 3,
                    class_name: "German Shepherd",
                    probability: 0.67
                },
                {
                    class_index: 4,
                    class_name: "Beagle",
                    probability: 0.45
                },
                {
                    class_index: 5,
                    class_name: "Poodle",
                    probability: 0.23
                }
            ],
            processing_time: "0.845 seconds",
            image_size: "800x600",
            format: "jpeg"
        };

        // Randomly fail sometimes to test error handling (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Mock classification failed');
        }

        return Promise.resolve({ data: mockResults });
    },
    Audio2Text: async function (formData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock response data
        const mockResults = [
            {
                transcript: "Hello, this is a test recording of the audio to text conversion system.",
                confidence: 0.95
            },
            {
                transcript: "The quick brown fox jumps over the lazy dog.",
                confidence: 0.88
            },
            {
                transcript: "This is an example of automated speech recognition.",
                confidence: 0.92
            }
        ];

        // Randomly fail sometimes (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Mock transcription failed');
        }

        return Promise.resolve({ data: mockResults });
    },
    Text2Audio: async function (data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock response data
        const mockResults = {
            success: true,
            data: {
                text: data.text,
                audio_path: `mock_audio_${Date.now()}.mp3`,
                duration: "2.5s",
                format: "mp3",
                timestamp: new Date().toISOString()
            }
        };

        // Randomly fail sometimes (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Text to speech conversion failed');
        }

        return Promise.resolve({ data: mockResults });
    },

    Text2AudioGetAudio: function (audioPath) {
        // For testing, return a sample audio URL
        return 'https://storage.googleapis.com/ac215-public-bucket/input-02.mp3';
    },

    StyleTransferGetContentImages: async function () {
        // Mock content images
        return {
            data: Array.from({ length: 12 }, (_, i) => `content-${i + 1}`)
        };
    },
    StyleTransferGetStyleImages: async function () {
        // Mock style images
        return {
            data: Array.from({ length: 12 }, (_, i) => `style-${i + 1}`)
        };
    },
    StyleTransferApplyStyleTransfer: async function (styleImage, contentImage) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            data: {
                stylized_image: 'result-image',
                style_image: styleImage,
                content_image: contentImage,
                processing_time: '2.5s'
            }
        };
    },
    StyleTransferGetImage: function (imagePath) {
        // For testing, return a placeholder image
        return `https://picsum.photos/400/400?random=${imagePath}`;
    },

    GetChats: async function (model, limit) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const limitedChats = mockChats.slice(0, limit || mockChats.length);
        return Promise.resolve({ data: limitedChats });
    },
    GetChat: async function (model, chat_id) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const chat = mockChats.find(c => c.chat_id === chat_id);
        if (!chat) {
            throw new Error('Chat not found');
        }
        return Promise.resolve({ data: chat });
    },
    StartChatWithLLM: async function (model, message) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newChat = {
            chat_id: uuid(),
            title: message.content.slice(0, 20) + "...",
            dts: Date.now(),
            messages: [
                {
                    message_id: uuid(),
                    role: "user",
                    content: message.content,
                    image_path: message.image_path
                },
                {
                    message_id: uuid(),
                    role: "assistant",
                    content: `Mock response to: ${message.content}`
                }
            ]
        };

        mockChats.unshift(newChat);
        return Promise.resolve({ data: newChat });
    },
    ContinueChatWithLLM: async function (model, chat_id, message) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const chat = mockChats.find(c => c.chat_id === chat_id);
        if (!chat) {
            throw new Error('Chat not found');
        }

        const newMessages = [
            {
                message_id: uuid(),
                role: "user",
                content: message.content,
                image_path: message.image_path
            },
            {
                message_id: uuid(),
                role: "assistant",
                content: `Mock response to: ${message.content}`
            }
        ];

        chat.messages.push(...newMessages);
        return Promise.resolve({ data: chat });
    },
    GetChatMessageImage: function (model, image_path) {
        // For testing, return a placeholder image
        return `https://picsum.photos/800/600?random=${encodeURIComponent(image_path)}`;
    },

    // Stock Market Data Services
    GetStockList: function () {
        return [
            { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
            { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
            { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
            { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
            { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial' },
            { symbol: 'V', name: 'Visa Inc.', sector: 'Financial' }
        ];
    },

    GetStockData: async function (symbol, days = 90) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const now = new Date();
        const data = [];
        const basePrice = Math.random() * 300 + 100;

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            const trend = Math.sin(i / 10) * 20;
            const noise = (Math.random() - 0.5) * 10;
            const price = basePrice + trend + noise;

            const volatility = Math.random() * 5;
            const open = price + (Math.random() - 0.5) * 3;
            const close = price + (Math.random() - 0.5) * 3;
            const high = Math.max(open, close) + Math.random() * volatility;
            const low = Math.min(open, close) - Math.random() * volatility;
            const volume = Math.floor(Math.random() * 50000000 + 10000000);

            data.push({
                date: date.toISOString().split('T')[0],
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume: volume
            });
        }

        return { data };
    },

    GetStockMetrics: async function (symbol) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const basePrice = Math.random() * 300 + 100;
        const change = (Math.random() - 0.5) * 20;
        const changePercent = (change / basePrice) * 100;

        return {
            data: {
                symbol: symbol,
                price: parseFloat(basePrice.toFixed(2)),
                change: parseFloat(change.toFixed(2)),
                changePercent: parseFloat(changePercent.toFixed(2)),
                volume: Math.floor(Math.random() * 50000000 + 10000000),
                marketCap: parseFloat((basePrice * (Math.random() * 1000 + 500) * 1000000).toFixed(0)),
                high52Week: parseFloat((basePrice * 1.3).toFixed(2)),
                low52Week: parseFloat((basePrice * 0.7).toFixed(2)),
                pe: parseFloat((Math.random() * 30 + 10).toFixed(2)),
                dividend: parseFloat((Math.random() * 3).toFixed(2)),
                beta: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2))
            }
        };
    },

    GetMovingAverages: async function (symbol) {
        await new Promise(resolve => setTimeout(resolve, 400));

        const basePrice = Math.random() * 300 + 100;

        return {
            data: {
                sma20: parseFloat((basePrice * 0.98).toFixed(2)),
                sma50: parseFloat((basePrice * 0.96).toFixed(2)),
                sma200: parseFloat((basePrice * 0.92).toFixed(2)),
                ema12: parseFloat((basePrice * 0.99).toFixed(2)),
                ema26: parseFloat((basePrice * 0.97).toFixed(2))
            }
        };
    },

    GetTechnicalIndicators: async function (symbol, days = 14) {
        await new Promise(resolve => setTimeout(resolve, 400));

        return {
            data: {
                rsi: parseFloat((Math.random() * 60 + 20).toFixed(2)),
                macd: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                signal: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                histogram: parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
                bollingerUpper: parseFloat((Math.random() * 50 + 150).toFixed(2)),
                bollingerMiddle: parseFloat((Math.random() * 30 + 130).toFixed(2)),
                bollingerLower: parseFloat((Math.random() * 30 + 110).toFixed(2))
            }
        };
    }
}

export default DataService;
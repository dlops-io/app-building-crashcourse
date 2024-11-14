import { BASE_API_URL, uuid } from "./Common";
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
        return 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav';
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
        console.log("/" + model + "/chats/?limit=" + limit)
        return await api.get("/" + model + "/chats?limit=" + limit);
    },
    GetChat: async function (model, chat_id) {
        return await api.get("/" + model + "/chats/" + chat_id);
    },
    StartChatWithLLM: async function (model, message) {
        return await api.post("/" + model + "/chats", message);
    },
    ContinueChatWithLLM: async function (model, chat_id, message) {
        return await api.post("/" + model + "/chats/" + chat_id, message);
    },
    GetChatMessageImage: function (model, image_path) {
        return BASE_API_URL + "/" + model + "/" + image_path;
    },
}

export default DataService;
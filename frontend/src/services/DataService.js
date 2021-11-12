import { BASE_API_URL } from "./Common";

const axios = require('axios');

const DataService = {
    Init: function () {
        // Any application initialization logic comes here
    },
    Text2Image: async function (obj) {
        return await axios.post(BASE_API_URL + "/text2image", obj);
    },

    ImageClassificationPredict: async function (formData) {
        return await axios.post(BASE_API_URL + "/imageclassification/predict", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    Audio2Text: async function (formData) {
        return await axios.post(BASE_API_URL + "/audio2text/transcribe", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    Text2Audio: async function (obj) {
        return await axios.post(BASE_API_URL + "/text2audio/synthesize", obj);
    },
    Text2AudioGetAudio: function (path) {
        return BASE_API_URL + "/text2audio/get_audio_data?path=" + path;
    },
    PlotsGetData: async function () {
        return await axios.get(BASE_API_URL + "/plots/get_data");
    },
    StyleTransferGetContentImages: async function () {
        return await axios.get(BASE_API_URL + "/styletransfer/content_images");
    },
    StyleTransferGetStyleImages: async function () {
        return await axios.get(BASE_API_URL + "/styletransfer/style_images");
    },
    StyleTransferApplyStyleTransfer: async function (style_img, content_img) {
        return await axios.get(BASE_API_URL + "/styletransfer/style_transfer?style=" + style_img + "&content=" + content_img);
    },
    StyleTransferGetImage: function (image_path) {
        return BASE_API_URL + "/styletransfer/get_image?image_path=" + image_path;
    }
}

export default DataService;
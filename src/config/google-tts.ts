import textToSpeech from "@google-cloud/text-to-speech";

const ttsClient = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.CLOUD_API_KEY || "",
});

export default ttsClient;

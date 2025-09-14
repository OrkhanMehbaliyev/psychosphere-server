import speech from "@google-cloud/speech";

const sstClient = new speech.v1.SpeechClient({
  apiKey: process.env.CLOUD_API_KEY || "",
});

export default sstClient;

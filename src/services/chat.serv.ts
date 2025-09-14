import fs from "fs";
import path from "path";
import type { google as textToSpeechGoogle } from "@google-cloud/text-to-speech/build/protos/protos.js";
import type {
  google,
  google as speechGoogle,
} from "@google-cloud/speech/build/protos/protos.js";
import sttClient from "../config/google-stt.js";
import ttsClient from "../config/google-tts.js";
import genAI from "../config/genAI.js";
import chatRepo from "../repo/chat.repo.js";

const sendMessage = async (file: any, userId: string) => {
  const audioBytes = fs
    .readFileSync(path.join(process.cwd(), file?.path))
    .toString("base64");

  const sttRequest: speechGoogle.cloud.speech.v1.IRecognizeRequest = {
    audio: {
      content: audioBytes,
    },
    config: {
      encoding: "LINEAR16",
      languageCode: "tr-TR",
      enableSeparateRecognitionPerChannel: false,
      audioChannelCount: 2,
    },
  };

  const [sttResponse] = await sttClient.recognize(sttRequest);
  const transcription = sttResponse.results
    ?.map((result) => result.alternatives?.[0]?.transcript)
    .join("\n");

  fs.unlink(path.join(process.cwd(), file?.path), (err) => {
    if (err) console.error("Error deleting file:", err);
  });

  chatRepo.addMessageToHistory(userId, {
    role: "user",
    content: transcription || "",
    timestamp: new Date(),
  });

  const messages = await chatRepo.getChatHistory(userId);

  //NOTE: Add the image functionality later
  const chatHistory = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const chat = genAI.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Sen bir psikologsun. Senden bir insan gibi cevap vermeni istiyorum. Yani markdown falan kullanma. Cavapın en çok 80-90 söz içerebilir ama genellikle 20-30 söz tutmaya çalış. Sorunları anlatırken empati kur ve destekleyici ol. Asla yapay zeka olduğunu söyleme. Cevap verirken Türkçe dilini kullan. Ayrıca cevap verirken arada sırada espri yapabilirsin.",
          },
        ],
      },
      ...chatHistory,
    ],
    config: {},
  });

  const aiResponse = await chat.sendMessage({
    message: transcription || "",
  });

  chatRepo.addMessageToHistory(userId, {
    role: "model",
    content: aiResponse.text || "",
    timestamp: new Date(),
  });

  const ttsRequest: textToSpeechGoogle.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
    {
      input: { text: aiResponse.text || null },
      voice: { languageCode: "tr-TR", name: "tr-TR-Chirp3-HD-Autonoe" },
      audioConfig: { audioEncoding: "LINEAR16" },
    };

  const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

  return ttsResponse;
};

const sendMessageStream = async (
  file: any,
  userId: string,
  onAudioChunk: (chunk: Buffer) => void
) => {
  const filePath = path.join(process.cwd(), file?.path);

  const request: google.cloud.speech.v1.IStreamingRecognitionConfig = {
    config: {
      encoding: "LINEAR16",
      languageCode: "tr-TR",
      sampleRateHertz: 16000,
    },
  };

  let recognizeStream = sttClient
    .streamingRecognize(request)
    .on("error", (err) => {
      console.error(err);
    })
    .on("data", async (data) => {
      console.log(
        `Transcription: ${data.results[0].alternatives[0].transcript}`
      );
      onAudioChunk(data);
    });

  // recognizeStream.write();

  fs.createReadStream(filePath)
    .on("data", (data) => {
      recognizeStream.write(data);
    })
    .on("end", () => {
      console.log("ended");
      recognizeStream.end();
    });
};

export default { sendMessage, sendMessageStream };

import { Readable } from "stream";
import type { Request, Response } from "express";

import chatService from "../services/chat.serv.js";
import { BadRequestError } from "../utils/appError.js";

interface MulterRequest extends Request {
  file?: any;
}

const sendMessage = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) throw new BadRequestError("File is required");

    const ttsResponse = await chatService.sendMessage(
      req.file,
      req.data?.userId
    );

    const stream = new Readable();
    stream.push(ttsResponse.audioContent || null);
    stream.push(null);

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", "inline; filename=tts.wav");
    stream.pipe(res);
  } catch (err) {
    throw err;
  }
};

const sendMessageStream = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) throw new BadRequestError("File is required");

    // headers BEFORE streaming
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Transfer-Encoding", "chunked");

    await chatService.sendMessageStream(
      req.file,
      req.data?.userId!,
      (chunk: Buffer) => {
        res.write(chunk); // push audio chunks to client
      }
    );

    res.end(); // close stream after all chunks
  } catch (err) {
    console.error("Controller error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default { sendMessage, sendMessageStream };

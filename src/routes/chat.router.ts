import { Router } from "express";
import chatHandler from "../handlers/chat.handler.js";
import multer from "multer";
import path from "path";

const chatRouter = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // your uploads folder
  },
  filename: (req, file, cb) => {
    // Get the original extension
    const ext = path.extname(file.originalname); // .wav, .mp3, etc.
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

chatRouter.post(
  "/message",
  upload.single("audio"),
  chatHandler.sendMessageStream
);

export default chatRouter;

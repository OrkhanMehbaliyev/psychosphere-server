import { model, Schema } from "mongoose";

export interface IMessage {
  role: "user" | "model";
  content: string;
  emotion?: string;
  timestamp: Date;
}

export interface IChat {
  userId: Schema.Types.ObjectId;
  messages: IMessage[];
}

const messageSchema = new Schema({
  role: { type: String, enum: ["user", "model"], required: true },
  content: { type: String, required: true },
  emotion: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  messages: [messageSchema],
});

export default model<IChat>("Chat", chatSchema);

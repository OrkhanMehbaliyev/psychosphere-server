import Chat, { type IMessage } from "../models/chat.model.js";

const getChatHistory = async (userId: string) => {
  const history = await Chat.findOne({ userId });
  return history?.messages || [];
};

const addMessageToHistory = async (userId: string, message: IMessage) => {
  await Chat.findOneAndUpdate(
    { userId },
    {
      $push: {
        messages: message,
      },
    },
    { upsert: true, new: true }
  );
};

export default { getChatHistory, addMessageToHistory };

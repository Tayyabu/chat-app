const asyncHandler = require("express-async-handler");
const { messageSchema } = require("../schema/chatMessageSchema");
const { z } = require("zod");
const db = require("../db/db");

const getChatMessagesWithChatId = asyncHandler(async (req, res) => {
  const id = req.query.chatId;

  if (!id) {
    return res.status(400).json({
      error: "Invalid Data",
      fieldErrors: ["chatId is required"],
    });
  }

  const messages = await db.message.findMany({
    where: { chatId: id },
    orderBy: { updatedAt: "desc" },
  });

  return res.json(messages);
});

const messageUpdateSchema = messageSchema.extend({
  senderId: z.string(),
});

const getAllChatMessages = asyncHandler(async (req, res) => {
  const messages = await db.message.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return res.json(messages);
});

const updateChatMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  
  const message = await db.message.findUnique({ where: { id } });
  if (!message)
    return res.json({
      errors: {
        message: "404 message not found",
      },
    });
  const { data, success, error } = messageUpdateSchema.safeParse(req.body);
  if (success) {
    await db.message.update({ where: { id }, data });
    return res.status(201).json({ message: "message updated successfully" });
  } else {
    return res.status(400).json(error.errors);
  }
});
const deleteChatMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await db.message.findUnique({ where: { id } });
  if (!message)
    return res.json({
      errors: {
        message: "404 message not found",
      },
    });

  await db.message.delete({ where: { id } });

  return res.sendStatus(204);
});

module.exports = {
  getChatMessagesWithChatId,
  updateChatMessage,
  getAllChatMessages,
  deleteChatMessage
};

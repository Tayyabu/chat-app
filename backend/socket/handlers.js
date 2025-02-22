const db = require("../db/db");
const { chatSchema, chatUpdateSchema } = require("../schema/chatSchema");
const {messageSchema}= require("../schema/chatMessageSchema")
const deleteMessage = (io, socket) => {
  return async (id) => {
    const message = await db.message.findUnique({ where: { id } });
    if (message && message.senderId === socket.user.id) {
      await db.message.delete({ where: { id } });

      io.to(message.chatId).emit("delete-message");
    }
  };
};
const createMessage = (io, socket) => async (chatId, content) => {
  const { success, error, data } = messageSchema.safeParse({
    chatId,
    content,
  });
  if (!success) {
    io.to(chatId).emit("error-message", error);
  }

  await db.message.create({
    data: {
      chatId: data.chatId,
      content: data.content,
      senderId: socket.user.id,
    },
  });

  io.to(chatId).emit("message", chatId);
};
const updateMessage =
  (io, socket) =>
  async ({ id, content }) => {
    const message = await db.message.findUnique({ where: { id } });

    if (
      message &&
      message.content !== content &&
      message.senderId === socket.user.id
    ) {
      await db.message.update({ where: { id }, data: { content } });
      io.to(message.chatId).emit("edit-message");
    }
  };
const typing = (socket) => async (chatId) => {
  socket.broadcast.to(chatId).emit("typing");
};

const deleteChat =
  (io) =>
  async ({ adminId, id }) => {
    const exists = await db.chat.findFirst({ where: { adminId, id } });

    if (exists) {
      await db.chat.delete({ where: { adminId, id } });
      io.emit("chat-deleted", exists.title);
    }
  };
const createChat = (socket) => async (data) => {
  const { data: chatData, success, error } = chatSchema.safeParse(data);

  if (success) {
    const duplicate = await db.chat.findFirst({
      where: { title: chatData.title },
    });
    if (duplicate) {
      socket.emit("chat-created", {
        errors: [
          {
            message: "Chat with this title already exists",
            field: "title",
          },
        ],
        chat: null,
      });
      return;
    }
    if (!chatData.users.length)
      return socket.emit("chat-created", {
        errors: [
          {
            message: "Selet Atleast one user",
            field: "users",
          },
        ],
        chat: null,
      });
    const chat = await db.chat.create({
      data: {
        adminId: socket?.user?.id,
        title: chatData.title,
        users: {
          connect: chatData.users.concat({
            id: socket.user.id,
            email: socket.user.email,
          }),
        },
      },
    });

    socket.emit("chat-created", { chat, errors: null });
  }

  socket.emit("chat-created", {
    errors: error?.errors.map(({ message, path }) => ({
      message,
      field: path.at(0),
    })),
    chat: null,
  });
};

const updateChat = (socket) => async (data) => {
  const { data: chatData, success, error } = chatUpdateSchema.safeParse(data);

  if (success ) {
    const exists = await db.chat.findUnique({
      where: { id: chatData.id },
    });
    if (!exists) {
      socket.emit("chat-updated", {
        errors: [
          {
            message: `Chat with this id ${chatData.id} does not exist`,
            field: "title",
          },
        ],
        chat: null,
      });
      return;
    }
    const duplicate = await db.chat.findFirst({
      where: { title: chatData.title },
    });
    if (duplicate && duplicate.id !== chatData.id) {
      socket.emit("chat-updated", {
        errors: [
          {
            message: "Chat with this title already exists",
            field: "title",
          },
        ],
        chat: null,
      });
      return;
    }
    if (exists.adminId !== socket.user.id)
      return socket.emit("chat-updated", {
        errors: [
          {
            message: "You cannot update this chat",
            field: "users",
          },
        ],
        chat: null,
      });
    if (!chatData.users.length)
      return socket.emit("chat-updated", {
        errors: [
          {
            message: "Selet Atleast one user",
            field: "users",
          },
        ],
        chat: null,
      });
    const chat = await db.chat.update({
      where: { id: chatData.id },
      data: {
        adminId: socket?.user?.id,
        title: chatData.title,
        users: {
          connect: chatData.users.concat({
            id: socket.user.id,
            email: socket.user.email,
          }),
        },
      },
    });

    socket.emit("chat-updated", { chat, errors: null });
  }

  socket.emit("chat-updated", {
    errors: error?.errors.map(({ message, path }) => ({
      message,
      field: path.at(0),
    })),
    chat: null,
  });
};

const joinChat = (socket) => async (chatId) => {
  const user = await db.user.findUnique({ where: { id: socket.user.id } });
  if (user.currentChatId && user.currentChatId !== chatId) {
    socket.leave(user.currentChatId);
    socket.broadcast
      .to(user.currentChatId)
      .emit("leave-chat", socket.user.email);
  }
  user.currentChatId = chatId;
  await db.user.update({ where: { id: socket.user.id }, data: user });

  socket.join(chatId);

  socket.to(chatId).emit("join-chat", socket.user.email);
};

module.exports = {
  deleteChat,
  joinChat,
  updateChat,
  createChat,
  deleteMessage,
  createMessage,
  updateMessage,
  typing,
};

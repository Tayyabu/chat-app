const { z } = require("zod");
const db = require("../db/db");
const { chatSchema } = require("../schema/chatSchema");
const chatSchemaForAdminPanel = chatSchema.extend({ adminId: z.string() });

const asyncHandler = require("express-async-handler");

const getChatGroupsForUsers = asyncHandler(async (req, res) => {
  const chatGroups = await db.chat.findMany({
    select: {
      id: true,
      title: true,
      adminId: true,
      createdAt: true,
      users: { select: { id: true, email: true } },
    },
  });

  return res.json(
    chatGroups.filter((chat) =>
      chat.users.map((user) => user.id).some((userId) => userId === req.user.id)
    )
  );
});
const getAllChats = asyncHandler(async (req, res) => {
  const chatGroups = await db.chat.findMany({
    select: {
      id: true,
      title: true,
      adminId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.json(chatGroups);
});
const createChat = asyncHandler(async (req, res) => {
  const {
    data: chatData,
    success,
    error,
  } = chatSchemaForAdminPanel.safeParse(req.body);

  if (success === true) {
    const duplicate = await db.chat.findFirst({
      where: { title: chatData.title },
    });
    if (duplicate) {
      return res.status(409).json({
        errors: [
          {
            message: "Chat with this title already exists",
            field: "title",
          },
        ],
        chat: null,
      });
    }
    if (!chatData.users.length)
      return res.status(400).json({
        errors: [
          {
            message: "Selet Atleast one user",
            field: "users",
          },
        ],
        chat: null,
      });
    const chatAdmin = await db.user.findUnique({
      where: { id: chatData.adminId },
    });

    if (!chatAdmin) {
      return res.status(400).json({
        errors: [
          {
            message: "Invalid adminId",
            field: "adminId",
          },
        ],
        chat: null,
      });
    }
    const chat = await db.chat.create({
      data: {
        adminId: chatData.adminId,
        title: chatData.title,
        users: {
          connect: chatData.users.concat([
            {
              id: chatAdmin.id,
              email: chatAdmin.email,
            },
          ]),
        },
      },
    });

    return res.status(201).json({ errors: null, chat });
  }

  return res.status(400).json({
    errors: error?.errors.map(({ message, path }) => ({
      message,
      field: path.at(0),
    })),
    chat: null,
  });
});
const updateChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exists = await db.chat.findUnique({
    where: { id },
    select: { users: true },
  });
  if (!exists) {
    return res.status(401).json({
      errors: [
        {
          message: `Chat with this id ${id}  not found`,
          
        },
      ],
      chat: null,
    });
  }
  const {
    data: chatData,
    success,
    error,
  } = chatSchemaForAdminPanel.safeParse(req.body);

  if (success === true) {
    const duplicate = await db.chat.findFirst({
      where: { title: chatData.title },
    });
    if (duplicate && duplicate.id !== id) {
      return res.status(409).json({
        errors: [
          {
            message: "Chat with this title already exists",
            field: "title",
          },
        ],
        chat: null,
      });
    }
    if (!chatData.users.length)
      return res.status(400).json({
        errors: [
          {
            message: "Select Atleast one user",
            field: "users",
          },
        ],

      });
    const chatAdmin = await db.user.findUnique({
      where: { id: chatData.adminId },
    });

    if (!chatAdmin) {
      return res.status(400).json({
        errors: [
          {
            message: "Invalid adminId",
            field: "adminId",
          },
        ],

      });
    }
    if (exists.users.map((user) => user.id).includes(chatAdmin.id)) {
      // check that the user with adminId is inside the users array

      const chat = await db.chat.update({
        where: { id },
        data: {
          adminId: chatData.adminId,
          title: chatData.title,
          users: {
            connect: chatData.users,
          },
        },
      });
      return res.status(201).json({ errors: null, chat });
    }
    const chat = await db.chat.update({
      where: { id },
      data: {
        adminId: chatData.adminId,
        title: chatData.title,
        users: {
          connect: chatData.users.concat([
            { id: chatAdmin.id, email: chatAdmin.email },
          ]),
        },
      },
    });

    return res.status(201).json({ errors: null, chat });
  }

  return res.status(400).json({
    errors: error?.errors.map(({ message, path }) => ({
      message,
      field: path.at(0),
    })),
    chat: null,
  });
});

const deleteChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const chatToDelete = await db.chat.findUnique({
    where: { id },
    select: { users: true },
  });
  if (!chatToDelete) {
    return res.status(401).json({
      errors: [
        {
          message: `Chat with this id ${id}  not found`,
         
        },
      ],
      chat: null,
    });
  }
  await db.chat.delete({ where: { id } });
  return res.status(204).json({ message: "Chat deleted successfully" });
});

module.exports = {
  getChatGroupsForUsers,
  getAllChats,
  createChat,
  updateChat,
  deleteChat
};

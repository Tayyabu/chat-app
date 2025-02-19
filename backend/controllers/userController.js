const db = require("../db/db");
const path = require("path");
const fsPromises = require("fs/promises");
const fs = require("fs");

const { z } = require("zod");
const userSchemaWithRoles = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  roles: z.array(z.enum(["Admin", "Staff", "User"])),
});
const asyncHandler = require("express-async-handler");
const hashPassword = require("../utils/hashPassword");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      chats: true,
      profilePic: true,
      roles: true,
    },
  });

  return res.json(
    users.map((user) => ({
      ...user,
      roles: user.roles.split(","),
      profilePic: `http://localhost:3000/users/${user.profilePic}`,
    }))
  );
});
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json("404 Not found");
  }
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true, chats: true, profilePic: true },
  });

  if (!user)
    return res.json({
      errors: {
        message: "404 not found",
      },
    });
  user.profilePic = `http://localhost:${process.env.PORT || 3000}/users/${
    user.profilePic
  }`;
  return res.json(user);
});

const profilePicController = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).send("No File Selected");
  const currentUser = await db.user.findUnique({ where: { id: req.user.id } });
  const pathToFile = path.join(
    __dirname,
    "..",
    "public",
    "users",
    currentUser.profilePic
  );
  if (currentUser.profilePic !== "default.png" && fs.existsSync(pathToFile)) {
    await fsPromises.unlink(pathToFile);
  }
  await db.user.update({
    where: { id: req.user.id },
    data: { profilePic: req.file.filename },
  });
  return res.status(201).send("File Uploaded Successfully");
});
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await db.user.findUnique({
    where: { id },
  });
  if (!user)
    return res.json({
      errors: {
        message: "404 not found",
      },
    });
  const { data, success, error } = userSchemaWithRoles.safeParse(req.body);

  if (success === true) {
    const duplicate = await db.user.findFirst({
      where: { email: data.email },
    });
    if (duplicate && duplicate.id !== id) {
      return res.status(409).json({
        errors: [
          {
            message: "User with this email already exists",
            field: "email",
          },
        ],
      });
    }
    if (!data.roles.length)
      return res.status(401).json({
        errors: [
          {
            message: "Unauthorized",
          },
        ],
      });

    const roles = Array.from(new Set([...data.roles]));
    console.log(roles);

    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      const updatedUser = await db.user.update({
        where: { id },
        data: {
          email: data.email,
          password: hashedPassword,
          roles: roles.join(","),
        },
      });
      return res.json(updatedUser);
    }

    const updatedUser = await db.user.update({
      where: { id },

      data: {
        email: data.email,
        roles: roles.join(","),
      },
    });
    return res.json(updatedUser);
  }
  res.json(error);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await db.user.findUnique({ where: { id } });
  if (!user)
    return res.json({
      errors: {
        message: "404 not found",
      },
    });
  await db.chat.deleteMany({
    where: {
      adminId: id,
    },
  });

  const deletedUser = await db.user.delete({ where: { id } });
  const pathToFile = path.join(
    __dirname,
    "..",
    "public",
    "users",
    deletedUser.profilePic
  );
  if (deletedUser.profilePic !== "default.png" && fs.existsSync(pathToFile)) {
    await fsPromises.unlink(pathToFile);
  }

  return res.sendStatus(204);
});
module.exports = {
  profilePicController,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};

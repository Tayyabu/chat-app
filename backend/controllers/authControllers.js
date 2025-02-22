const { userSchema } = require("../schema/userSchema");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyPassword = require("../utils/verifyPassword");

const db = require("../db/db");

const loginContoller = expressAsyncHandler(async (req, res) => {
  const { success, data, error } = userSchema.safeParse(req.body);

  if (success === false) {
    return res.status(400).json({
      error: "Invalid Data",
      fieldErrors: error.errors,
    });
  }

  const user = await db.user.findFirst({
    where: { email: data.email },
  });
  if (!user) return res.status(401).json({ error: "You are not authorized" });

  const isValidPassword = await verifyPassword(
    data.password,
    user.password.trim()
  );
  if (!isValidPassword)
    return res.status(401).json({ error: "You are not authorized" });

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      chat: user.currentChatId,
      roles: user.roles.split(","),
    },
    process.env.REFRESH_SECRET,
    { expiresIn: "10d" }
  );
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      chat: user.currentChatId,
      roles: user.roles.split(","),
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,

    maxAge: 86400 * 1000 * 30,
  });

  return res.json({
    accessToken,
    id: user.id,
    roles: user.roles.split(","),
    currentChatId: user.currentChatId,
  });
});

const refreshController = expressAsyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) return res.status(403).json({ error: "Forbidden" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET,
    async (error, decoded) => {
      if (error) {
        return;
      }

      const user = await db.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) return res.status(403).json({ error: "Forbidden" });

      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          chat: user.currentChatId,
          roles: user.roles.split(","),
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({
        accessToken,
        id: user.id,
        roles: user.roles.split(","),
        currentChatId: user.currentChatId,
      });
    }
  );
});

const logOutController = (req, res) => {
  if (!req.cookies?.jwt)
    return res.status(200).json({ message: "You are logged out" });
  res.clearCookie("jwt");

  return res.status(200).json({ message: "You are logged out" });
};

module.exports = { loginContoller, refreshController, logOutController };

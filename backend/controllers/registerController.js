const { userSchema } = require("../schema/userSchema");
const expressAsyncHandler = require("express-async-handler");
const hashPassword = require("../utils/hashPassword");

const db = require("../db/db");
const registerController = expressAsyncHandler(async (req, res) => {
  const { success, data, error } = userSchema.safeParse(req.body);

  if (success === false) {
    console.log(error);

    return res.status(400).json({
      error: "Invalid Data",
      fieldErrors: error.errors,
    });
  }

  const { email, password } = data;

  const duplicate = await db.user.findFirst({ where: { email } });
  if (duplicate) {
    return res.status(409).json({
      message: `A user with the email ${email} already exists`,
    });
  }
  const hashedPassword = await hashPassword(password.trim());

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword
      },
    
  });
  return res.status(201).json({messsage:"You are registered"});
});

module.exports = registerController;

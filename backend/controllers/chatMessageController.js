const asyncHandler = require("express-async-handler");
const db = require("../db/db");

const getChatMessagesWithChatId = asyncHandler(async (req, res) => {
  const id = req.query.chatId;

  if (!id) {
    return res.status(400).json({
      error: "Invalid Data",
      fieldErrors: ["chatId is required"],
    });
  }

  const messages = await db.message.findMany({where:{chatId:id},orderBy:{updatedAt:"desc"}});
  
  return res.json(messages);
});


const createChatMessage =asyncHandler(async (req,res) => {

  
})



module.exports = { getChatMessagesWithChatId };

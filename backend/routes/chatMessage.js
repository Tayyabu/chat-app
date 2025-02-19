const express = require("express");
const { getChatMessagesWithChatId } = require("../controllers/chatMessageController");
const router = express.Router();

router.route("/").get(getChatMessagesWithChatId);

module.exports = router;

const express = require("express");
const {
  getChatMessagesWithChatId,
  getAllChatMessages,
  updateChatMessage,
  deleteChatMessage,
} = require("../controllers/chatMessageController");
const verifyRoles = require("../middleware/verifyRole");
const router = express.Router();

router.route("/").get(getChatMessagesWithChatId);
router.route("/all").get(verifyRoles("Staff"), getAllChatMessages);
router
  .route("/:id")
  .put(verifyRoles("Staff"), updateChatMessage)
  .delete(verifyRoles("Admin"), deleteChatMessage);

module.exports = router;

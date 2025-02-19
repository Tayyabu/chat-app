const express = require("express");
const {
  getChatGroupsForUsers,
  getAllChats,
  createChat,
  updateChat,
  deleteChat,
} = require("../controllers/chatGroupController");
const verifyRoles = require("../middleware/verifyRole");
const router = express.Router();

router
  .route("/")
  .get(getChatGroupsForUsers)
  .post(verifyRoles("Staff"), createChat);
router
  .route("/:id")
  .put(verifyRoles("Staff"), updateChat)
  .delete(verifyRoles("Admin"), deleteChat);
router.route("/all").get(verifyRoles("Staff"), getAllChats);
module.exports = router;

const express = require("express");
const path = require("path");
const verifyRole = require("../middleware/verifyRole");
const {
  getAllUsers,
  profilePicController,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "public", "users"),
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + file.originalname);
  },
});

const upload = multer({ storage: storage, limits: 3e6 });
router.route("/").get(getAllUsers);
router
  .route("/:id")
  .get(getUser)
  .put(verifyRole("Admin"), updateUser)
  .delete(verifyRole("Admin"), deleteUser);
router.post("/profilePic/upload", upload.single("file"), profilePicController);
module.exports = router;

const express = require("express");
const registerController = require("../controllers/registerController");
const router = express.Router();

router.route("/").post(registerController);

module.exports = router;
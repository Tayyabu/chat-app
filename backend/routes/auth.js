const express = require("express");
const { refreshController, loginContoller, logOutController } = require("../controllers/authControllers");
const router = express.Router();

router.post("/", loginContoller);
router.get("/refresh", refreshController);
router.get("/", logOutController);
module.exports = router;

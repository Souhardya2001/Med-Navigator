const express = require("express");
const authController = require("../controllers/authController");
const isLoggedIn = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/profile", isLoggedIn, authController.profile);

module.exports = router;

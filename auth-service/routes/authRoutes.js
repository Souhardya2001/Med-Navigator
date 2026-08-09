const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const isLogIn = require('../middlewares/authMiddleware');

router.post('/create', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/profile', isLogIn, authController.profile);
module.exports = router;
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const validation = require('../middleware/validation.middleware');
const chat = require('../controllers/chat.controller');
const message = require('../controllers/message.controller');

router.use(auth);
router.post('/', validation.title, chat.create);
router.get('/', validation.pagination, chat.list);
router.get('/:chatId', validation.chatId, chat.get);
router.delete('/:chatId', validation.chatId, chat.remove);
router.get('/:chatId/messages', validation.chatId, validation.pagination, message.list);
router.post('/:chatId/messages', validation.chatId, validation.message, message.create);
module.exports = router;

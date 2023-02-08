import express from 'express';
import {
    createMessage,
    getMessage
} from '../controllers/messageController.js'
import {
    verifyToken,
} from '../middlewares/verifyToken.js';
const router = express.Router()
router.post('/',createMessage)
router.get('/:conversationId',getMessage)
export default router
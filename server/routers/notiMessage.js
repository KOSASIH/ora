import express from 'express';
import {
    getMessagesNotifications,
    readMessagesNotification
} from '../controllers/notificationsMessages.js'
import {
    verifyToken,
} from '../middlewares/verifyToken.js';
const router = express.Router()
// router.post('/', verifyToken,createPostNotifications)
router.get('/', verifyToken,getMessagesNotifications)
router.put('/read', verifyToken,readMessagesNotification )

export default router
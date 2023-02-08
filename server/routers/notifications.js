import express from 'express';
import {
    createPostNotifications,
    getPostNotifications,
    readPostNotifications
} from '../controllers/notificationsController.js'
import {
    verifyToken,
} from '../middlewares/verifyToken.js';
const router = express.Router()
router.post('/', verifyToken,createPostNotifications)
router.get('/', verifyToken,getPostNotifications)
router.put('/read', verifyToken,readPostNotifications )

export default router
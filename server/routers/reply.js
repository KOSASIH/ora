import express from 'express';
import {
    replyComment,
    getReplyComment,
    voteReplyComment
} from '../controllers/replyController.js'
import {
    verifyToken,
} from '../middlewares/verifyToken.js';
const router = express.Router()
router.post('/:id', verifyToken, replyComment)
router.get('/:id', getReplyComment)
router.post('/reply/vote', verifyToken, voteReplyComment)
export default router
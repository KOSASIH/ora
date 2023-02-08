import express from 'express';
import {
    getCommentsPost,
    createComment,
    deleteComment,
    voteComment,
    voteComment2,
} from '../controllers/commentController.js'
import {
    verifyToken,
} from '../middlewares/verifyToken.js';
const router = express.Router()
router.get('/:id', getCommentsPost)
router.post('/create', verifyToken, createComment)
router.post('/vote', verifyToken, voteComment)
router.post('/delete', verifyToken, deleteComment)
router.post('/vote2', verifyToken, voteComment2)
export default router
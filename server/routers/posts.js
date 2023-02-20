import express from 'express';
import {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    uploadImage,
    getPost,
    getPostsByCategory,
    getPostsByUserName,
    votePost,
    updateView,
    getPostUserSaved,
    getAllPostsCategoryUser,
} from '../controllers/postController.js'
import {
    verifyToken
} from '../middlewares/verifyToken.js';
import {
    upload
} from '../middlewares/multers.js'
const router = express.Router()
router.put('/:postId', verifyToken, updatePost)
router.delete('/:postId', verifyToken, deletePost)
router.get('/:slug', getPost)
router.get('/user/:username', getPostsByUserName)
router.get('/cate/:cateId', getPostsByCategory)
router.post('/upload', upload.single('file'), uploadImage)
router.post('/', verifyToken, createPost)
router.get('/', getAllPosts)
router.post('/vote/', verifyToken, votePost)
router.post('/views', updateView)
router.post('/saved/post', getPostUserSaved)
router.get('/category/post', verifyToken,getAllPostsCategoryUser)
export default router
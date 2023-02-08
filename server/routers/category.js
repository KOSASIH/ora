import express from 'express';
import {
    getAllCategories,
    uploadImage,
    deleteCategory,
    createCategory,
    getCategory,
    updateCategory
} from '../controllers/categoryController.js';
import {
    upload
} from '../middlewares/multers.js'
const router = express.Router()
const hiiu = [66]
router.put('/:cateId', updateCategory)
router.delete('/:cateId', deleteCategory)
router.post('/create', createCategory)
router.post('/upload/:cateId', upload.single('file'), uploadImage)
router.get('/:slug', getCategory)
router.get('/', getAllCategories)
export default router
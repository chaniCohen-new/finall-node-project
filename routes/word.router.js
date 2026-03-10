import express from 'express';
import multer from 'multer'; 
import {
    createNewWord,
    getAllWords,
    getWordById,
    getWordsByLessonId,
    updateWord,
    deleteWord
} from '../controllers/word.controller.js'; 
import { validateBody } from '../middlewares/validate.middleware.js'; 
import { wordJoi } from '../models/word.modal.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'images/' }); // הגדרת תיקיית העלאת הקבצים ל-images

// ראשית - routes ספציפיים (עם פרמטר מסוים בנתיב)
router.get('/lesson/:lesson', getWordsByLessonId); // ✅ קודם!
router.get('/:id', auth, getWordById);

// שנית - routes כלליים
router.post('/', auth, validateBody(wordJoi), upload.single('image'), createNewWord);
router.get('/', auth, getAllWords);

// שלישית - routes עם פעולות (PUT, DELETE)
router.put('/:id', auth, validateBody(wordJoi), upload.single('image'), updateWord); // ✅ עם ID!
router.delete('/:id', auth, deleteWord); // ✅ עם ID!

export default router;
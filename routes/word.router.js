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

router.post('/words',auth, validateBody(wordJoi), upload.single('image'), createNewWord);
router.get('/words',auth, getAllWords);
router.get('/words/:id',auth, getWordById);
router.get('/words/lesson/:lesson', getWordsByLessonId);
router.put('/words',auth, validateBody(wordJoi), updateWord);
router.delete('/words',auth, deleteWord);

export default router;
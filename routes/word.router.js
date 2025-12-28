import express from 'express';
import multer from 'multer'; // שימוש במולטויר כדי לנהל עליית קבצים

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
import {auth} from '../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // הגדרת תיק העלאת הקבצים

router.post('/words',validateBody(wordJoi), upload.single('image'), createNewWord);
router.get('/words', getAllWords);
router.get('/words/:id', getWordById);
router.get('/words/lesson/:lesson', getWordsByLessonId);
router.put('/words',validateBody(wordJoi), updateWord);
router.delete('/words', deleteWord);

export default router;
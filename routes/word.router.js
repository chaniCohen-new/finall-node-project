import express from 'express';
import {
    createNewWord,
    getAllWords,
    getWordById,
    getWordsByLessonId,
    updateWord,
    deleteWord
} from '../controllers/word.controller.js'; // עדכן את הנתיב בהתאם
import { validateBody } from '../middlewares/validate.middleware.js'; 
import { wordJoi } from '../models/word.modal.js';
import {auth} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/words',validateBody(wordJoi), createNewWord);
router.get('/words', getAllWords);
router.get('/words/:id', getWordById);
router.get('/words/lesson/:lesson', getWordsByLessonId);
router.put('/words',validateBody(wordJoi), updateWord);
router.delete('/words', deleteWord);

export default router;
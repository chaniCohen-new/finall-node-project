import express from 'express';
import {
    createNewWord,
    getAllWords,
    getWordById,
    getWordsByLessonId,
    updateWord,
    deleteWord
} from '../controllers/word.controller.js'; // עדכן את הנתיב בהתאם

const router = express.Router();

router.post('/words', createNewWord);
router.get('/words', getAllWords);
router.get('/words/:id', getWordById);
router.get('/words/lesson/:lesson', getWordsByLessonId);
router.put('/words', updateWord);
router.delete('/words', deleteWord);

export default router;
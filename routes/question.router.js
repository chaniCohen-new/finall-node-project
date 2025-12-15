import express from 'express';
import {
    createNewQuest,
    getQuestionById,
    getQuestionsByLessonId,
    updateQuestion,
    deleteQuestion
} from '../controllers/question.controller.js'; // נקה את הנתיב בהתאם

const router = express.Router();

// מסלול ליצירת שאלה חדשה
router.post('/questions', createNewQuest);

// מסלול לקבלת שאלות לפי מזהה לקורס
router.get('/questions/lesson/:lesson', getQuestionsByLessonId);

// מסלול לקבלת שאלה לפי מזהה שלה
router.get('/questions/:id', getQuestionById);

// מסלול לעדכון שאלה
router.put('/questions', updateQuestion);

// מסלול למחיקת שאלה
router.delete('/questions', deleteQuestion);

export default router;
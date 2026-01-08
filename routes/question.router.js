import express from 'express';
import {auth} from '../middlewares/auth.middleware.js';
import {
    createNewQuest,
    getQuestionById,
    getQuestionsByLessonId,
    updateQuestion,
    deleteQuestion
} from '../controllers/question.controller.js'; // נקה את הנתיב בהתאם

const router = express.Router();

// מסלול ליצירת שאלה חדשה
router.post('/questions',auth, createNewQuest);

// מסלול לקבלת שאלות לפי מזהה לקורס
router.get('/questions/lesson/:lesson', getQuestionsByLessonId);

// מסלול לקבלת שאלה לפי מזהה שלה
router.get('/questions/:id',auth, getQuestionById);

// מסלול לעדכון שאלה
router.put('/questions',auth, updateQuestion);

// מסלול למחיקת שאלה
router.delete('/questions',auth, deleteQuestion);

export default router;
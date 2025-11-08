import express from 'express';
import { createNewLesson, getAllLessons, getLessonsByLevel, getLessonById, deleteLesson, updateLesson } from '../controllers/lesson.controller.js';

const router = express.Router();

router.post('/', createNewLesson);

router.get('/', getAllLessons);

router.get('/level/:level', getLessonsByLevel);

router.get('/:id', getLessonById);

router.put('/:id', updateLesson);

router.delete('/', deleteLesson);

export default router;
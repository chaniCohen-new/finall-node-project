import express from 'express';
import { createNewLesson, getAllLessons, getLessonsByLevel, getLessonById, deleteLesson, updateLesson } from '../controllers/lesson.controller.js';

import { validateBody } from '../middlewares/validate.middleware.js'; 
import { lessonJoi } from '../models/lesson.model.js';

const router = express.Router();
import {auth} from '../middlewares/auth.middleware.js';

router.post('/', validateBody(lessonJoi), createNewLesson);

router.get('/', getAllLessons);

router.get('/level/:level', getLessonsByLevel);

router.get('/:id', getLessonById);

router.put('/:id', validateBody(lessonJoi), updateLesson);

router.delete('/', deleteLesson);

export default router;
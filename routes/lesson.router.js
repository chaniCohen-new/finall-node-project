import express from 'express';
import { createNewLesson, getAllLessons, getLessonsByLevel, getLessonById, deleteLesson, updateLesson } from '../controllers/lesson.controller.js';

import { validateBody } from '../middlewares/validate.middleware.js'; 
import { lessonJoi } from '../models/lesson.model.js';

const router = express.Router();
import {auth} from '../middlewares/auth.middleware.js';

router.post('/',auth, validateBody(lessonJoi), createNewLesson);

router.get('/',auth, getAllLessons);

router.get('/level/:level', getLessonsByLevel);

router.get('/:id',auth, getLessonById);

router.put('/:id',auth, validateBody(lessonJoi), updateLesson);

router.delete('/',auth, deleteLesson);

export default router;
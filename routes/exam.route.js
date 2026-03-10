import { Router } from 'express'

import { getAllExams, getExamById, addExam, getExamsByUserId} from "../controllers/exam.controller.js"
import {auth} from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js'; 
import { examJoi } from '../models/exam.model.js';

const router = Router();
router.get('/',auth, getAllExams);
router.get('/user/:userId', auth, getExamsByUserId);
router.get('/:id',auth, getExamById);
router.post('/',auth, validateBody(examJoi), addExam)

export default router;
import { Router } from 'express'

import { getAllExams, getExamById, addExam } from "../controllers/exam.controller.js"

import { validateBody } from '../middlewares/validate.middleware.js'; 
import { examJoi } from '../models/exam.model.js';

const router = Router();
router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/', validateBody(examJoi), addExam)

export default router;
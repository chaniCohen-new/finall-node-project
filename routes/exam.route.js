import { Router } from 'express'

import { getAllExams, getExamById, addExam } from "../controllers/exam.controller.js"

const router = Router();
router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/', addExam)

export default router;
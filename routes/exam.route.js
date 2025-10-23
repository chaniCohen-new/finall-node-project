import express  from "express"
const router = express.Router()

import { getAllExams, getExamById, addExam } from "../controllers/exam.controller.js"

router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/', addExam)

export default router;
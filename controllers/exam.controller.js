import Exam from "../models/exam.model";

export const getAllExams = async (req, res, next) => {
    if (req.user.role == 'admin')
        try {
            const exams = await Exam.find();
            return res.json(exams);
        }
        catch (error) {
            return next({ error });
        }
    return res.json({ msg: "permission denied" })
};

export const addExam = async (req, res, next) => {
    if (req.user.role === 'user') {
        try {
            // בדיקות קלט
            const { mark, lesson } = req.body;
            if (!mark || !lesson) {
                return res.status(400).json({ msg: "Mark and lesson are required." });
            }

            // יצירת המבחן החדש
            const newExam = new Exam(req.body);
            await newExam.save();
            return res.status(201).json(newExam);
        } catch (error) {
            return next({ error: error.message, status: 500 });
        }
    }
    return res.status(403).json({ msg: "Permission denied" });
};

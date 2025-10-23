import Exam from "../models/exam.model.js";

export const getAllExams = async (req, res, next) => {
    if (req.user.role === 'admin')
        try {
            const exams = await Exam.find();
            return res.json(exams);
        }
        catch (error) {
            return next({ error });
        }
    return res.json({ msg: "permission denied" })
};

export const getExamById = async (req, res, next) => {
    const { id } = req.params;
    if (req.user.role === 'user')
        try {
            const exam = await Exam.findOne({ _id: id });// SELECT * FROM exams WHERE _id=id
            if (!exam) {
                return next({
                    error: new Error(`exam ${id} not found!`),
                    status: 404
                });
            }
            return res.json(exam);
        } catch (error) {
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


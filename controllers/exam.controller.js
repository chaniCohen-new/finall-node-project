import Exam from "../models/exam.model.js";

// ✅ חדש: קבלת ציונים של משתמש מסוים
export const getExamsByUserId = async (req, res, next) => {
    const { userId } = req.params;

    // בדיקה: המשתמש יכול לראות רק את הציונים שלו, או הוא admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ msg: "permission denied" });
    }

    try {
        const exams = await Exam.find({ user: userId })
            .populate('lesson'); // ✅ הבא גם את פרטי השיעור

        if (!exams || exams.length === 0) {
            return res.json([]);
        }

        return res.json(exams);
    } catch (error) {
        return next(error);
    }
};

export const getAllExams = async (req, res, next) => {
    if (req.user.role !== 'admin') {  // ✅ הוסף !==
        return res.status(403).json({ msg: "permission denied" });
    }

    try {
        const exams = await Exam.find().populate('lesson');
        return res.json(exams);
    } catch (error) {
        return next(error);
    }
};

export const getExamById = async (req, res, next) => {
    const { id } = req.params;

    // ✅ תוקן: צריך להיות user או admin
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ msg: "permission denied" });
    }

    try {
        const exam = await Exam.findOne({ _id: id }).populate('lesson');

        if (!exam) {
            return next({
                error: new Error(`exam ${id} not found!`),
                status: 404
            });
        }

        // ✅ בדיקה: המשתמש יכול לראות רק את הציונים שלו, או הוא admin
        if (exam.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ msg: "permission denied" });
        }

        return res.json(exam);
    } catch (error) {
        return next(error);
    }
};

export const addExam = async (req, res, next) => {
    try {
        const { mark, lesson, createdAt } = req.body;  
        const userId = req.user._id;

        const newExam = new Exam({
            user: userId,
            mark,
            lesson,
            createdAt: createdAt || new Date()  
        });

        await newExam.save();
        const populatedExam = await newExam.populate('lesson'); 
        res.json(populatedExam);
    } catch (error) {
        return next(error);
    }
};

export const deleteExam = async (req, res, next) => {
    const { id } = req.body;

    try {
        const exam = await Exam.findOne({ _id: id });

        if (!exam) {
            return next({
                error: new Error(`exam ${id} not found!`),
                status: 404
            });
        }

        // ✅ רק המשתמש שלו או admin יכולים למחוק
        if (exam.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ msg: "permission denied" });
        }

        await Exam.deleteOne({ _id: id });
        return res.json({ msg: "exam deleted successfully" });
    } catch (error) {
        return next(error);
    }
};
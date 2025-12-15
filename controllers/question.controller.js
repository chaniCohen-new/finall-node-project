import Question from "../models/question.modal.js";

export const createNewQuest = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { lesson, optional, answer, question } = req.body;
            if (!question) return res.status(400).send("question is required!");
            if (!lesson) return res.status(400).send("lesson is required!");
            if (!answer) return res.status(400).send("answer is required!");
            if (!optional?.length) return res.status(400).send("optional is required!");

            const checkWTL = await Question.find({ lesson, answer, question });
            if (checkWTL?.length) return res.status(400).send("lesson | optional | answer | question already exists");

            const wordx = await Question.create({ lesson, optional, answer, question });
            console.log("createNewQuest", wordx);
            return res.json(wordx);
        }
        return res.json({ msg: "permission denied" });
    } catch (error) {
        next(error); // מפנה למידלוור של השגיאות
    }
};

export const getQuestionsByLessonId = async (req, res, next) => {
    try {
        const { lesson } = req.params;
        console.log(lesson, 'lrs');
        if (!lesson) return res.status(400).send("idLessons is required!");

        const allWordsInLesson = await Question.find({ lesson: lesson }).sort({ word: 1 });
        console.log(allWordsInLesson);
        if (!allWordsInLesson?.length) return res.json({ msg: "not exist in this lesson" });

        return res.json(allWordsInLesson);
    } catch (error) {
        next(error); // מפנה למידלוור של השגיאות
    }
};

export const getQuestionById = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { id } = req.params;
            if (!id) return res.status(400).send("id is required!");
            const word = await Question.find({ _id: id });
            if (!word?.length) return res.status(400).send("not exist!");
            return res.json(word);
        }
        return res.json({ msg: "permission denied" });
    } catch (error) {
        next(error); // מפנה למידלוור של השגיאות
    }
};

export const updateQuestion = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { _id, lesson, optional, answer, question } = req.body;
            if (!_id) return res.status(400).send("id is required!");
            if (!question) return res.status(400).send("question is required!");
            if (!lesson) return res.status(400).send("lesson is required!");
            if (!answer) return res.status(400).send("answer is required!");
            if (!optional?.length) return res.status(400).send("optional is required!");

            const quest = await Question.findOne({ _id });
            if (!quest) return res.status(400).send("not exist");

            const checkWTL = await Question.findOne({ lesson, answer, question });
            if (checkWTL?.length && checkWTL._id !== _id) return res.status(400).send("lesson | optional | answer | question already exists");

            quest.question = question;
            quest.answer = answer;
            quest.optional = optional;
            quest.lesson = lesson;

            const update = await quest.save();
            return res.json(update);
        }
        return res.json({ msg: "permission denied" });
    } catch (error) {
        next(error); // מפנה למידלוור של השגיאות
    }
};

export const deleteQuestion = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { _id } = req.body;
            console.log("idddd", _id);
            const word = await Question.findById(_id);
            if (!word) return res.status(400).send("not found");

            await word.deleteOne();
            const deleted = `${_id} deleted`;
            return res.send(deleted);
        }
        return res.json({ msg: "permission denied" });
    } catch (error) {
        next(error); // מפנה למידלוור של השגיאות
    }
};

export default { createNewQuest, getQuestionById, getQuestionsByLessonId, updateQuestion, deleteQuestion };

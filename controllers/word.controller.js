import Word from "../models/word.modal.js";

export const createNewWord = async (req, res, next) => {
    // if (req.user.role === "admin") {
        try {
            const { word, translating, lesson } = req.body;
        const imageUrl = req.file ? req.file.filename : ""; // אם קובץ קיים, אז קח את השם שלו

            if (!word) return res.status(400).send("word is required!");
            if (!translating) return res.status(400).send("translating is required!");
            if (!lesson) return res.status(400).send("lesson is required!");

            const checkWTL = await Word.find({ word, translating, lesson });
            if (checkWTL?.length) return res.status(400).send("Word & Translation in this level already exist!");

            const wordx = await Word.create({ word, translating, Img: imageUrl, lesson });
            return res.json(wordx);
        } catch (error) {
            return next(error); // הפניית השגיאה למידלוואר
        // }
    }
    return res.json({ msg: "permission denied" });
};

export const getAllWords = async (req, res, next) => {
    // if (req.user.role === "admin") {
        try {
            const allLessons = await Word.find().sort({ word: 1 }).lean();
            return res.json(allLessons);
        } catch (error) {
            return next(error); // הפניית השגיאה למידלוואר
        }
    // }
    return res.json({ msg: "permission denied" });
};

export const getWordsByLessonId = async (req, res, next) => {
    const { lesson } = req.params;
    if (!lesson) return res.status(400).send("id is required!");

    try {
        const allWordsInLesson = await Word.find({ lesson }).sort({ word: 1 });
        if (!allWordsInLesson?.length) return res.json({ msg: "not exist in this lesson" });
        return res.json(allWordsInLesson);
    } catch (error) {
        return next(error); // הפניית השגיאה למידלוואר
    }
};

export const getWordById = async (req, res, next) => {
    if (req.user.role === "admin") {
        const { id } = req.params;
        if (!id) return res.status(400).send("id is required!");

        try {
            const word = await Word.find({ _id: id });
            if (!word?.length) return res.status(400).send("not exist!");
            return res.json(word);
        } catch (error) {
            return next(error); // הפניית השגיאה למידלוואר
        }
    }
    return res.json({ msg: "permission denied" });
};

export const updateWord = async (req, res, next) => {
    if (req.user.role === "admin") {
        const { _id, word, translating, lesson } = req.body;
        if (!_id) return res.status(400).send("id is required!");
        if (!word) return res.status(400).send("word is required!");
        if (!translating) return res.status(400).send("translating is required!");
        if (!lesson) return res.status(400).send("lesson is required!");

        try {
            const wordd = await Word.findOne({ _id });
            if (!wordd) return res.status(400).send("not exist");

            const imageUrl = req.file?.filename ? req.file.filename : wordd.Img || ""; 
            if (wordd.word !== word || wordd.translating !== translating || wordd.lesson !== lesson) {
                const checkWTL = await Word.findOne({ _id, word, translating, lesson });
                if (checkWTL?.length && checkWTL._id !== _id) return res.status(400).send("word & translating in this lesson already exist!");
            }

            wordd.word = word;
            wordd.translating = translating;
            wordd.lesson = lesson;
            wordd.Img = imageUrl;

            const update = await wordd.save();
            return res.json(update);
        } catch (error) {
            return next(error); // הפניית השגיאה למידלוואר
        }
    }
    return res.json({ msg: "permission denied" });
};

export const deleteWord = async (req, res, next) => {
    // if (req.user.role === "admin") {
        const { _id } = req.body;
        try {
            const word = await Word.findById(_id);
            if (!word) return res.status(400).send("not found");

            await word.deleteOne();
            return res.send(`${_id} deleted`);
        } catch (error) {
            return next(error); // הפניית השגיאה למידלוואר
        }
    // }
    // return res.json({ msg: "permission denied" });
};

export default { createNewWord, getAllWords, getWordById, getWordsByLessonId, updateWord, deleteWord };
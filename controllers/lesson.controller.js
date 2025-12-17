import Lesson from '../models/lesson.model.js';
import Word from '../models/word.modal.js';

export const createNewLesson = async (req, res, next) => {
    // if (req.user.role == "admin") {
        const { level, category } = req.body; 
        console.log("kkkkkkkkkkkkkkkkkkkkk", { level, category });

        if (!level) return res.status(400).send("Level is require!");
        if (!category) return res.status(400).send("Category is require!");

        try {
            // חפש אם יש כבר שיעור עם אותו level ו-category
            const checkLevelCategory = await Lesson.find({ category, level }).lean();
            console.log({ checkLevelCategory });

            // אם יש שיעור קיים, שלח הודעת שגיאה
            if (checkLevelCategory?.length) return res.status(401).send("level & category are exist!!");

            await Lesson.create({ level, category });
            return res.json({ level, category }); // שלח את השיעור שנוסף
        } catch (error) {
            next(error); // הפניית השגיאה למידלוואר
        }
    // }
    return res.json({ msg: "permission denied" }); // אם המשתמש לא אדמין
};

export const getAllLessons = async (req, res, next) => {
    // if (req.user.role == "admin") {
        try {
            const allLessons = await Lesson.find().sort({ category: 1 }).lean();
            return res.json(allLessons);
        } catch (error) {
            next(error); // הפניית השגיאה למידלוואר
        // }
    }
    return res.json({ msg: "permission denied" });
};

export const getLessonsByLevel = async (req, res, next) => {
    const { level } = req.params;
    try {
        const allLessons = await Lesson.find({ level }).sort({ category: 1 }).lean();
        return res.json(allLessons);
    } catch (error) {
        next(error); // הפניית השגיאה למידלוואר
    }
};

export const getLessonById = async (req, res, next) => {
    if (req.user.role == "admin") {
        const { id } = req.params;
        if (!id) return res.status(400).send("id is require!");

        try {
            const lesson = await Lesson.find({ _id: id });
            if (!lesson?.length) return res.status(400).send("not exist!");
            return res.json(lesson);
        } catch (error) {
            next(error); // הפניית השגיאה למידלוואר
        }
    }
    return res.json({ msg: "permission denied" });
};

export const updateLesson = async (req, res, next) => {
    if (req.user.role == "admin") {
        const { _id, level, category } = req.body; // קבל את ה-id, level וה-category מהבקשה

        if (!_id) return res.status(400).send("id is require!");
        if (!level) return res.status(400).send("level is require!");
        if (!category) return res.status(400).send("category is require!");

        try {
            const lesson = await Lesson.findById(_id);
            if (!lesson) return res.status(400).send("not exist");

            // אם ה-level או ה-category שונים מהערכים הקיימים
            if (lesson.level !== level || lesson.category !== category) {
                // חפש אם יש שיעור אחר עם אותם level ו-category
                const checkLevelCategory = await Lesson.find({ category, level }).lean();
                console.log({ checkLevelCategory });

                // אם יש שיעור קיים, שלח הודעת שגיאה
                if (checkLevelCategory?.length) return res.status(400).send("level & category are exist!!");
            }

            // עדכן את ה-category וה-level של השיעור
            lesson.category = category;
            lesson.level = level;

            // שמור את השיעור המעודכן
            const update = await lesson.save();
            return res.json(update); 
        } catch (error) {
            next(error); // הפניית השגיאה למידלוואר
        }
    }
    return res.json({ msg: "permission denied" }); // אם המשתמש לא אדמין
};

export const deleteLesson = async (req, res, next) => {
    if (req.user.role == "admin") {
        const { _id } = req.body;
        try {
            const less = await Lesson.findById(_id);
            if (!less) return res.status(400).send("not found");

            const words = await Word.find({ lesson: less._id });
            await Promise.all(words.map(word => word.deleteOne()));

            await less.deleteOne();
            const deleted = `${_id} deleted`;
            return res.send(deleted);
        } catch (error) {
            next(error); // הפניית השגיאה למידלוואר
        }
    }
    return res.json({ msg: "permission denied" });
};

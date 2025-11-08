import Lesson from '../models/lesson.model.js';
import Word from '../models/word.modal.js';

export const createNewLesson = async (req, res) => {
    if (req.user.role == "admin") {
        const { level, category } = req.body; 
        console.log("kkkkkkkkkkkkkkkkkkkkk", { level, category });

        if (!level) return res.status(400).send("Level is require!");
        if (!category) return res.status(400).send("Category is require!");

        // חפש אם יש כבר שיעור עם אותו level ו-category
        const checkLevelCategory = await (await Lesson.find({ category, level })).map(less => {
            return { category: less.category, level: less.level };
        });
        console.log({ checkLevelCategory });

        // אם יש שיעור קיים, שלח הודעת שגיאה
        if (checkLevelCategory?.length) return res.status(401).send("level & category are exist!!");

        await Lesson.create({ level, category });
        return res.json({ level, category }); // שלח את השיעור שנוסף
    }
    return res.json({ msg: "permission denied" }); // אם המשתמש לא אדמין
};

export const getAllLessons = async (req, res) => {
    if (req.user.role == "admin") {
        const allLessons = await Lesson.find().sort({ category: 1 }).lean();
        return res.json(allLessons);
    }
    return res.json({ msg: "permission denied" });
}

export const getLessonsByLevel = async (req, res) => {
    const { level } = req.params;
    const allLessons = await Lesson.find({ level }).sort({ category: 1 }).lean();
    return res.json(allLessons);
}

export const getLessonById = async (req, res) => {
    if (req.user.role == "admin") {
        const { id } = req.params;
        if (!id) return res.status(400).send("id is require!");

        const lesson = await Lesson.find({ _id: id });
        if (!lesson?.length) return res.status(400).send("not exist!");
        return res.json(lesson);
    }
    return res.json({ msg: "permission denied" });
}

export const updateLesson = async (req, res) => {
    if (req.user.role == "admin") {
        const { _id, level, category } = req.body; // קבל את ה-id, level וה-category מהבקשה

        if (!_id) return res.status(400).send("id is require!");
        if (!level) return res.status(400).send("level is require!");
        if (!category) return res.status(400).send("category is require!");

        const lesson = await Lesson.find({ _id });
        if (!lesson) return res.status(400).send("not exist");

        // אם ה-level או ה-category שונים מהערכים הקיימים
        if (lesson.level !== level || lesson.category !== category) {
            // חפש אם יש שיעור אחר עם אותם level ו-category
            const checkLevelCategory = await (await Lesson.find({ category, level })).map(less => {
                return { category: less.category, level: less.level };
            });
            console.log({ checkLevelCategory });

            // אם יש שיעור קיים, שלח הודעת שגיאה
            if (checkLevelCategory?.length) return res.status(400).send("level & category are exist!!");
        }

        // חפש את השיעור בעזרת ה-id
        const less = await Lesson.findById(_id).exec();
        // אם השיעור לא נמצא, שלח הודעת שגיאה
        if (!less) return res.status(400).send("not found");

        // עדכן את ה-category וה-level של השיעור
        less.category = category;
        less.level = level;

        // שמור את השיעור המעודכן
        const update = await less.save();
        return res.json(update); 
    }
    return res.json({ msg: "permission denied" }); // אם המשתמש לא אדמין
};

export const deleteLesson = async (req, res) => {
    if (req.user.role == "admin") {
        const { _id } = req.body;
        const less = await Lesson.findById(_id);
        const words = await Word.find({ lesson: less._id });

        if (!less) return res.status(400).send("not found");

        words.map(word => word.deleteOne());
        const result = await less.deleteOne();

        const deleted = `${_id} deleted`;
        return res.send(deleted);
    }
    return res.json({ msg: "permission denied" });
};


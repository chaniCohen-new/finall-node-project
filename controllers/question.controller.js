import Question from "../models/question.modal.js";

export const createNewQuest = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { lesson, optional, answer, question } = req.body;

            // ✅ Validation
            if (!question?.trim()) return res.status(400).json({ error: "question is required!" });
            if (!lesson?.trim()) return res.status(400).json({ error: "lesson is required!" });
            if (!answer?.trim()) return res.status(400).json({ error: "answer is required!" });
            if (!Array.isArray(optional) || optional.length === 0) {
                return res.status(400).json({ error: "optional must be a non-empty array!" });
            }

            // ✅ Clean optional array
            const cleanedOptional = optional
                .map(opt => opt.trim())
                .filter(opt => opt.length > 0);

            if (cleanedOptional.length === 0) {
                return res.status(400).json({ error: "optional must contain valid items!" });
            }

            // ✅ Check for duplicates
            const checkDuplicate = await Question.findOne({ 
                lesson, 
                question: question.trim() 
            });
            
            if (checkDuplicate) {
                return res.status(400).json({ error: "This question already exists for this lesson!" });
            }

            // ✅ Verify answer is in optional
            if (!cleanedOptional.includes(answer.trim())) {
                return res.status(400).json({ error: "Answer must be one of the optional answers!" });
            }

            const newQuestion = await Question.create({
                lesson,
                optional: cleanedOptional,
                answer: answer.trim(),
                question: question.trim(),
            });

            return res.status(201).json(newQuestion);
        }

        return res.status(403).json({ error: "Permission denied" });
    } catch (error) {
        next(error);
    }
};

export const getQuestionsByLessonId = async (req, res, next) => {
    try {
        const { lesson } = req.params;

        if (!lesson?.trim()) {
            return res.status(400).json({ error: "Lesson ID is required!" });
        }

        // ✅ Populate הקטגוריה מהשיעור
        const questions = await Question.find({ lesson })
            .populate('lesson', 'category level name') // ✅ טען את פרטי השיעור
            .sort({ createdAt: 1 });

        if (questions.length === 0) {
            return res.status(404).json({ error: "No questions found for this lesson" });
        }

        return res.json(questions);
    } catch (error) {
        next(error);
    }
};

export const getQuestionById = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { id } = req.params;

            if (!id) return res.status(400).json({ error: "ID is required!" });

            const question = await Question.findById(id);

            if (!question) {
                return res.status(404).json({ error: "Question not found!" });
            }

            return res.json(question);
        }

        return res.status(403).json({ error: "Permission denied" });
    } catch (error) {
        next(error);
    }
};

export const updateQuestion = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { _id, lesson, optional, answer, question } = req.body;

            if (!_id) return res.status(400).json({ error: "ID is required!" });
            if (!question?.trim()) return res.status(400).json({ error: "Question is required!" });
            if (!lesson?.trim()) return res.status(400).json({ error: "Lesson is required!" });
            if (!answer?.trim()) return res.status(400).json({ error: "Answer is required!" });
            if (!Array.isArray(optional) || optional.length === 0) {
                return res.status(400).json({ error: "Optional must be a non-empty array!" });
            }

            const cleanedOptional = optional
                .map(opt => opt.trim())
                .filter(opt => opt.length > 0);

            if (!cleanedOptional.includes(answer.trim())) {
                return res.status(400).json({ error: "Answer must be one of the optional answers!" });
            }

            const quest = await Question.findByIdAndUpdate(
                _id,
                {
                    question: question.trim(),
                    answer: answer.trim(),
                    optional: cleanedOptional,
                    lesson,
                },
                { new: true, runValidators: true }
            );

            if (!quest) return res.status(404).json({ error: "Question not found!" });

            return res.json(quest);
        }

        return res.status(403).json({ error: "Permission denied" });
    } catch (error) {
        next(error);
    }
};

export const deleteQuestion = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const { _id } = req.body;

            if (!_id) return res.status(400).json({ error: "ID is required!" });

            const deletedQuestion = await Question.findByIdAndDelete(_id);

            if (!deletedQuestion) {
                return res.status(404).json({ error: "Question not found!" });
            }

            return res.json({ success: true, message: `Question ${_id} deleted successfully` });
        }

        return res.status(403).json({ error: "Permission denied" });
    } catch (error) {
        next(error);
    }
};

export default { 
    createNewQuest, 
    getQuestionById, 
    getQuestionsByLessonId, 
    updateQuestion, 
    deleteQuestion 
};
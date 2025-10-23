import { model, Schema } from "mongoose";
import Joi from "joi";

const lessonModel = new Schema({
    level: {
        type: String,
        enum: ["level 1", "level 2", 'level 3'],
    },
    category: {
        type: String,
    }
});

export const lessonJoi = Joi.object({
    level: Joi.string().valid("level 1", "level 2", "level 3").required(),
    category: Joi.string().required(),
});

export default model("Lesson", lessonModel);

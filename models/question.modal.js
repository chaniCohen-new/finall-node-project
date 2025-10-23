import mongoose, { model, Schema, SchemaTypes } from "mongoose";
import Joi from "joi";
import JoiObjectId from "joi-objectid";

const questionModel = new Schema({
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
    optional: {
        type: [String],
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    }
});

const joiObjectId = JoiObjectId(Joi);

export const questionJoi = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    optional: Joi.array().items(Joi.string()).required(), // רשימה של מחרוזות
    lesson: joiObjectId().required(),
});

export default model("Question", questionModel);

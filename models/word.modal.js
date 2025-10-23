import mongoose, { model, Schema, SchemaTypes } from "mongoose";
import Joi from "joi";

const WordModel = new Schema({
    word: {
        type: String,
    },
    translating: {
        type: String,
    },
    Img: {
        type: String,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    }
});

export const wordJoi = Joi.object({
    word: Joi.string().required(),
    translating: Joi.string().required(),
    Img: Joi.string().uri().optional(), // אם יש תמונה, ניתן לבדוק אם זה URI תקין
    lesson: Joi.string().required() 
});

export default model('Word', WordModel);
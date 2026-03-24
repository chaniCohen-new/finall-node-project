import mongoose, { model, Schema, SchemaTypes } from "mongoose";
import Joi from 'joi';
import JoiObjectId from "joi-objectid";

const examModel = new Schema({
    mark: {
        type: Number,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const joiObjectId = JoiObjectId(Joi);

export const examJoi = Joi.object({
    mark: Joi.number()
        .min(0) 
        .max(100)
        .required(),
    lesson: joiObjectId().required(),
    user: joiObjectId().optional(),
    createdAt: Joi.date().optional()  
});

export default model("Exam", examModel);
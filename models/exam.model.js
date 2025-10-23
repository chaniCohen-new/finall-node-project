import mongoose, { model, Schema, SchemaTypes } from "mongoose";
import Joi from "joi";
import JoiObjectId from "joi-objectid";

const examModel = new Schema({
    mark: {
        type: String,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const joiObjectId = JoiObjectId(Joi);

export const examJoi = Joi.object({
    mark: Joi.string()
        // .pattern(/^[0-9]{1,2}(\.[0-9]{1,2})?$/) // בדיקה שהציון הוא מספר עם עד 2 ספרות שלמות ועד 2 ספרות אחרי הנקודה
        .min(0) 
        .max(100)
        .required(),
    lesson: joiObjectId().required(),
    user: joiObjectId().required() 
});

export default model("Exam", examModel);
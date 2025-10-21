import mongoose, { model, Schema, SchemaTypes } from "mongoose";

const examModel = new Schema({
    mark: {
        type: String,
        required: true,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Lesson"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

export default model("Exam", examModel);
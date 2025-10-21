import mongoose, { model, Schema, SchemaTypes } from "mongoose";

const questionModel = new Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    optional: {
        type: [String],
        required: true,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Exam"
    }
});

export default model("Question", questionModel);

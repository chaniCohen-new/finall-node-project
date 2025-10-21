import mongoose, { model, Schema, SchemaTypes } from "mongoose";

const WordModel = new Schema({
    word: {
        type: String,
        required: true
    },
    translating: {
        type: String,
        required: true,
    },
    Img: {
        type: String,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Lesson"
    }
});

export default model('Word', WordModel);
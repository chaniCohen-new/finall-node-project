import { model, Schema } from "mongoose";

const lessonModel = new Schema({
    level: {
        type: String,
        required: true,
        enum: ["level 1", "level 2", 'level 3'],
    },
    category: {
        type: String,
        required: true,
    }
})

export default model("Lesson", lessonModel);

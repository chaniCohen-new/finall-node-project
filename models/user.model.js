import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

export default model('User', userSchema);
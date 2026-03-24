import { model, Schema } from "mongoose";
import Joi from "joi";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true,
        lowercase: true,
    },
    password: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        immutable: true,
    },
});

// ✅ בדיקת סיסמה חזקה
const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('סיסמה חייבת להיות לפחות 8 תווים');
    if (!/[A-Z]/.test(password)) errors.push('אות גדולה אחת לפחות');
    if (!/[a-z]/.test(password)) errors.push('אות קטנה אחת לפחות');
    if (!/[0-9]/.test(password)) errors.push('ספרה אחת לפחות');
    if (!/[!@#$%^&*]/.test(password)) errors.push('תו מיוחד אחד (!@#$%^&*)');
    return errors;
};

export const userJoi = {
    login: Joi.object({
        username: Joi.string().required().messages({'any.required': '❌ שם משתמש חובה'}),
        password: Joi.string().required().messages({'any.required': '❌ סיסמה חובה'}),
    }),
    register: Joi.object({
        username: Joi.string().required().min(3),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        phone: Joi.string().optional(),
        role: Joi.string().valid('user', 'admin').default('user'),
    }),
};

export { validatePassword };
export default model('User', userSchema);
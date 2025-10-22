import { model, Schema } from "mongoose";
import Joi from "joi";

const userSchema = new Schema({
    username: String,
    password: String,
    email: { type: String, unique: true },
    phone: String,
    role: String,
});

export const userJoi = {
    login: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    }),
    register: Joi.object({
        username: Joi.string().required().min(2),
        password: Joi.string().required().pattern(/^[a-zA-Z0-9]{8,30}$/),
        email: Joi.string().required().email(),
        phone: Joi.string().pattern(/^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/),
        role: Joi.string().valid('user', 'admin').default('user')
    }),
    updatePassword: Joi.object({
        password: Joi.string().required().pattern(/^[a-zA-Z0-9]{8,30}$/),
        repeatPassword: Joi.ref('password'),
    }),
};

export default model('User', userSchema);
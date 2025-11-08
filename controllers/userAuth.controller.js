import User, { userJoi } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {

    const { username, password } = req.body;

    // בדוק אם כל השדות הדרושים קיימים
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // חפש את המשתמש בבסיס הנתונים
    const user = await User.findOne({ username }).lean();
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // השווה את הסיסמאות
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // צור אובייקט משתמש עם נתונים רלוונטיים
    const userToken = {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: user.role
    };

    // צור טוקן גישה
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // החזר את הטוקן ואת תפקיד המשתמש
    res.json({ token: token, role: userToken.role });
};

export const register = async (req, res, next) => {

    const { username, password, email, phone, role } = req.body;

    // בדוק אם כל השדות הדרושים קיימים
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // בדוק אם המשתמש קיים כבר
    const duplicate = await User.findOne({ username }).lean();
    if (duplicate) {
        return res.status(409).json({ message: "User already exists" });
    }

    // חסן את הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {  email, username, password: hashedPassword, phone, role };

    // צור את המשתמש בבסיס הנתונים
    const user = await User.create(userObj);
    if (user) {
        return res.status(201).json({ message: "User registered successfully" });
    } else {
        return res.status(500).json({ message: "Registration failed" });
    }
};
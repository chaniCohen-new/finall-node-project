import User, { userJoi } from "../models/user.model.js";
import Exam from "../models/exam.model.js";
import bcrypt from 'bcrypt'; // וודא שייבאת את bcrypt


export const addUser = async (req, res, next) => {
    const { username, password, email, phone, role } = req.body;
    const user = req.user;

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can add users.' });
    }

    try {
        // וודא שכל השדות קיימים
        if (!username || !password || !email || !phone || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // בדוק אם שם המשתמש כבר קיים
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // בדוק אם אימייל כבר קיים
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // צפה שהתפקיד חוקי
        if (role !== 'admin' && role !== 'user') {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const newUser = new User({ 
            username, 
            password, 
            email, 
            phone, 
            role 
        });

        await newUser.save();
        
        return res.status(201).json({ 
            message: 'User added successfully', 
            user: newUser 
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    if (req.user.role === "admin") {
    try {
        const allUsers = await User.find({}, { password: 0 }).sort({ name: 1 });
        return res.json(allUsers);
    } catch (error) {
        next(error); // הפניית השגיאה למידלוואר
    }
}
    return res.status(401).json({ msg: 'denied' });
};

export const getUsersById = async (req, res, next) => {
    if (req.user.role == "admin") {
        const { id } = req.params;
        if (!id) return res.status(400).send("id is require!");

        try {
            const user = await User.findOne({ _id: id }, { password: 0 });
            return res.json(user);
        } catch (error) {
            next(error); // הפניית השגיאה למידלוואר
        }
    }

    if (req.user.role == "user") {
        const _id = req.user._id;

        try {
            const user = await User.findOne({ _id }, { password: 0 });
            return res.json(user);
        } catch (error) {
            next(error); // הפניית השגיאה למידלוואר
        }
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const loggedInUserRole = req.user.role;
        const _id = req.params.id;

        if (!_id) {
            return res.status(400).json({ message: 'ID is required!' });
        }

        const userToUpdate = await User.findById(_id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ ניהול עדכון עבור admin
        if (loggedInUserRole === 'admin') {
            const { username, email, phone, role, password } = req.body;

            // וודא שלא יותר מדי שדות עודכנו
            if (username && username !== userToUpdate.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({ message: 'Username already exists' });
                }
                userToUpdate.username = username;
            }

            if (email && email !== userToUpdate.email) {
                const existingEmail = await User.findOne({ email });
                if (existingEmail) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                userToUpdate.email = email;
            }

            if (phone) userToUpdate.phone = phone;

            if (role && ['admin', 'user'].includes(role)) {
                userToUpdate.role = role;
            } else if (role) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            // עדכן סיסמה רק אם נמסרה
            if (password && password.trim()) {
                const hashPass = await bcrypt.hash(password, 10);
                userToUpdate.password = hashPass;
            }

            const updatedUser = await userToUpdate.save();
            return res.json({ 
                message: 'User updated successfully',
                user: updatedUser 
            });
        }

        // ✅ ניהול עדכון עבור user (עדכון עצמי בלבד)
        if (loggedInUserRole === 'user') {
            const currentUserId = req.user._id.toString();
            const targetUserId = _id.toString();

            if (currentUserId !== targetUserId) {
                return res.status(403).json({ message: 'You can only update your own profile' });
            }

            const { email, phone, password } = req.body;

            if (email && email !== userToUpdate.email) {
                const existingEmail = await User.findOne({ email });
                if (existingEmail) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                userToUpdate.email = email;
            }

            if (phone) userToUpdate.phone = phone;

            if (password && password.trim()) {
                const hashPass = await bcrypt.hash(password, 10);
                userToUpdate.password = hashPass;
            }

            const updatedUser = await userToUpdate.save();
            return res.json({ 
                message: 'Profile updated successfully',
                user: updatedUser 
            });
        }

        return res.status(403).json({ message: 'Forbidden' });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        // ✅ בדוק הרשאות - רק מנהל יכול למחוק
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "❌ רק מנהל יכול למחוק משתמשים" });
        }

        const userId = req.body._id;

        if (!userId) {
            return res.status(400).json({ message: "❌ User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "❌ User not found" });
        }

        // ✅ מחק את כל הבחנים של המשתמש
        const exams = await Exam.find({ user: userId });
        await Promise.all(exams.map(exam => exam.deleteOne()));

        // ✅ מחק את המשתמש
        await User.findByIdAndDelete(userId);
        
        return res.json({ 
            message: `✅ User deleted successfully`,
            deletedUserId: userId 
        });
    } catch (error) {
        next(error);
    }
};

export default { addUser, getAllUsers, getUsersById, updateUser, deleteUser };

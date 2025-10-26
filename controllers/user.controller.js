import User, { userJoi } from "../models/user.model.js";

// פונקציה להוספת משתמש
export const addUser = async (req, res, next) => {
    const { username, password, email, phone, role } = req.body;

    const user = req.user; // תפקיד המנהל צריך להיות מאומת כאן

    // בדוק אם המשתמש הוא מנהל
    if (user && user.role === 'admin') {
        try {
            const newUser = new User({ username, password, email, phone, role });
            await newUser.save();
            return res.status(201).json({ message: 'User added successfully', user: newUser });
        } catch (error) {
            return res.status(500).json({ message: 'Error adding user', error });
        }
    } else {
        return res.status(403).json({ message: 'Access denied. Only admins can add users.' });
    }
};

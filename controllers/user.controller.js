import User, { userJoi } from "../models/user.model.js";
import Exam from "../models/exam.model.js";

// פונקציה להוספת משתמש
export const addUser = async (req, res, next) => {
    const { username, password, email, phone, role } = req.body;

    const user = req.user; 

    // בדוק אם המשתמש הוא מנהל
    if (user && user?.role === 'admin') {
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

export const getAllUsers = async (req, res) => {
    // if (req.user.role == "admin") {

        const allUsers = await User.find({}, { password: 0 }).sort({ name: 1 })
        return res.json(allUsers)
    }
    // return res.json({ msg: 'denied' }).status(401)
// };

export const getUsersById = async (req, res) => {
    if (req.user.role == "admin") {
        const { id } = req.params
        if (!id) return res.status(400).send("id is require!")
        const user = await User.findOne({ _id: id }, { password: 0 })
        return res.json(user)
    }
    if (req.user.role == "user") {
        const _id = req.user._id
        const user = await User.findOne({ _id }, { password: 0 })
        return res.json(user)
    }
};



export const deleteUser = async (req, res) => {
    const _id = req.user?.role === "user" ? req.user._id : req.body._id;

    const user = await User.findById(_id);
    if (!user) return res.status(400).send("not found");

    if (req.user?.role !== "user") {
        const exams = await Exam.find({ user: _id });
        await Promise.all(exams.map(exam => exam.deleteOne()));
    }

    await user.deleteOne();
    return res.send(`${_id} deleted`);
};

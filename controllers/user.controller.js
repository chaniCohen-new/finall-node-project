import User, { userJoi } from "../models/user.model.js";
import Exam from "../models/exam.model.js";

export const addUser = async (req, res, next) => {
    const { username, password, email, phone, role } = req.body;
    const user = req.user;

    // if (user.role === 'admin') {
    try {
        const newUser = new User({ username, password, email, phone, role });
        await newUser.save();
        return res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        next(error); // הפניית השגיאה למידלוואר
    }
    // } else {
    //     return res.status(403).json({ message: 'Access denied. Only admins can add users.' });
    // }
};

export const getAllUsers = async (req, res, next) => {
    // if (req.user.role === "admin") {
    try {
        const allUsers = await User.find({}, { password: 0 }).sort({ name: 1 });
        return res.json(allUsers);
    } catch (error) {
        next(error); // הפניית השגיאה למידלוואר
    }
}
//     return res.status(401).json({ msg: 'denied' });
// };

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

        // ניהול עדכון עבור המשתמשים עם תפקיד "admin"
        if (loggedInUserRole === "admin") {
            const { _id, role } = req.body;
            console.log("user", { _id, role });

            if (!_id) return res.status(400).send("ID is required!");

            if (role && role !== "admin" && role !== "user") {
                return res.status(400).send("Invalid role!");
            }

            const userToUpdate = await User.findById(_id).exec();
            if (!userToUpdate) return res.status(404).send("User not found");

            userToUpdate.role = role || userToUpdate.role; // עדכון תפקיד אם נמסר

            const updatedUser = await userToUpdate.save();
            console.log(updatedUser);
            return res.json(updatedUser);
        }

        // ניהול עדכון עבור משתמשים עם תפקיד "user"
        if (loggedInUserRole === "user") {
            const _id = req.user._id; // מזהה של המשתמש המחובר
            const { username, password, email, name } = req.body;

            if (!_id) return res.status(400).send("ID is required!");
            if (!username) return res.status(400).send("Username is required!");

            const currentUser = await User.findById(_id);
            if (!currentUser) return res.status(404).send("User not found");

            if (currentUser.username !== username) {
                const usernameExists = await User.findOne({ username });
                if (usernameExists && usernameExists._id.toString() !== _id) {
                    return res.status(400).send("Username already in use!");
                }
            }

            if (username.toLowerCase() !== username) {
                return res.status(400).send("Username must be lowercase!");
            }

            let hashPass;
            if (password) {
                if (password === 0) return res.status(400).send("Password cannot be empty!");
                hashPass = await bcrypt.hash(password, 10);
            }

            currentUser.username = username;
            currentUser.password = hashPass ? hashPass : currentUser.password; // עדכון סיסמה רק אם נמסרה
            currentUser.email = email;
            currentUser.name = name;

            const updatedUser = await currentUser.save();
            console.log(updatedUser);
            return res.json(updatedUser);
        }

        return res.status(403).send("Forbidden!"); // בתור כלל יסודי אם לא עונה לאף תנאי
    } catch (error) {
        next(error); // הפניית השגיאה למידלוואר
    }
};

export const deleteUser = async (req, res, next) => {
    const _id = req.user?.role === "user" ? req.user._id : req.body._id;

    try {
        const user = await User.findById(_id);
        if (!user) return res.status(400).send("not found");

        if (req.user?.role !== "user") {
            const exams = await Exam.find({ user: _id });
            await Promise.all(exams.map(exam => exam.deleteOne()));
        }

        await user.deleteOne();
        return res.send(`${_id} deleted`);
    } catch (error) {
        next(error); // הפניית השגיאה למידלוואר
    }
};

export default { addUser, getAllUsers, getUsersById, updateUser, deleteUser };

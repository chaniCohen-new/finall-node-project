import jwt from "jsonwebtoken";

// מידלאוור לבדוק הרשאות משתמש
export const auth = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log('Authorization header:', authorization);

        if (!authorization) {
            return next({ error: new Error('Authorization header is missing'), status: 401 });
        }

        const [, token] = authorization.split(' '); // כאן אתה מגדיר את ה-token
        console.log('Token:', token); // עכשיו זה יפעל

        const secretKey = process.env.JWT_SECRET ?? 'SecretKey';
        const currentUser = jwt.verify(token, secretKey);

        // שמירת נתוני המשתמש ב-req.user
        req.user = {
            _id: currentUser.userId, // הנח שה-ID של המשתמש נמצא ב-userId
            role: String(currentUser.role) // המרת ה-role למחרוזת
        };

        next();
    } catch (error) {
        return next({ error: new Error('Authorization failed'), status: 401 });
    }
};

import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log('Authorization header:', authorization);

        if (!authorization) {
            return next({ 
                error: new Error('Authorization header is missing'), 
                status: 401 
            });
        }

        // ✅ בדוק שה-format הוא "Bearer TOKEN"
        if (!authorization.startsWith('Bearer ')) {
            return next({ 
                error: new Error('Invalid authorization format'), 
                status: 401 
            });
        }

        const token = authorization.slice(7); // ✅ הוצא את ה-token אחרי "Bearer "
        
        console.log('Token:', token);

        if (!token) {
            return next({ 
                error: new Error('Token is empty'), 
                status: 401 
            });
        }

        const secretKey = process.env.JWT_SECRET ?? 'SecretKey';
        const currentUser = jwt.verify(token, secretKey);

        req.user = {
            _id: currentUser.userId,
            role: String(currentUser.role)
        };

        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return next({ 
            error: new Error('Authorization failed'), 
            status: 401 
        });
    }
};
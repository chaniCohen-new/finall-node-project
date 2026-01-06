// ES6 ייבוא של
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path'; // ייבוי המודול path
import { fileURLToPath } from 'url';

// ייבוא של כל הראוטרים
import examRouter from './routes/exam.route.js';
import lessonRouter from './routes/lesson.router.js';
import userRauter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import wordRouter from './routes/word.router.js';
import questionRouter from './routes/question.router.js'; // נקה את הנתיב בהתאם

// ייבוא של מידלאוורים
import {auth} from './middlewares/auth.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';


import { connectDB } from './config/db.js';

// .env מרגע זה ניתן לקרוא בכל הקבצים בפרויקט את הנתונים מהקובץ
config();

// יצירת השרת
const app = express();

connectDB();

app.use(json());
app.use(urlencoded());

// הקפיצה ל- __dirname עבור מודולי ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגדרת תיקית התמונות כסטטית
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(express.static('/images'))

// cors - גישה לכל קליינט
app.use(cors());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/exams', examRouter);
app.use('/lessons', lessonRouter);
app.use('/users', userRauter);
app.use('/', questionRouter);
app.use('/', authRouter);
app.use('/', wordRouter);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

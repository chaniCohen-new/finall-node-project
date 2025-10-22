// ES6 ייבוא של
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';

// ייבוא של כל הראוטרים


import { connectDB } from './config/db.js';

// .env מרגע זה ניתן לקרוא בכל הקבצים בפרויקט את הנתונים מהקובץ
config();

// יצירת השרת
const app = express();

connectDB();

app.use(json());
app.use(urlencoded());
// cors - גישה לכל קליינט
app.use(cors());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

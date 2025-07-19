import Express from 'express';
import cors from 'cors';
import routes from './router/routes.js';
import db from './config/db.js';
import cookieParser from 'cookie-parser';

const app = Express();
app.use(cookieParser())
app.use(Express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(routes)


app.listen(3000, () => console.log("berjalan di localhost:3000"))
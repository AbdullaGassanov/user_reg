import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import {
	createUser,
	loginUser,
	getUsers,
	logoutUser,
	getUserById,
	toggleUserStatus,
} from './controllers/userController.js';
import { protect } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

dotenv.config();
console.log('Проверка переменных:', process.env.MONGO_URI);

const app = express();

const connectStr: string | undefined = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;

//Мидлвэры

app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: ['http://localhost', 'http://localhost:5173'],
		credentials: true,
	}),
);

// Регистрация
app.post('/api/users/register', createUser);

// Логин
app.post('/api/users/login', loginUser);

// Получение списка
app.get('/api/users', protect, getUsers);

// Поиск конкретного пользователя
app.get('/api/users/:id', protect, getUserById);

// Блокировка/Разблокировка
app.patch('/api/users/toggle/:id', protect, toggleUserStatus);

//Выход
app.post('/api/users/logout', logoutUser);

//Default
app.get('/', (req: Request, res: Response) => {
	res.end('NodeJS');
});

if (!connectStr) {
	throw new Error('Не удалось подключится к mongo');
}

mongoose
	.connect(connectStr)
	.then(() => console.log('MongoDB подключен!'))
	.catch((err) =>
		console.error(' Ошибка подключения к MongoDB:🛑', err.message),
	);

app.listen(PORT, () => {
	console.log('Server connected on port: ', PORT);
});

import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

interface AuthRequest extends Request {
	user?: {
		id: string;
		role: string;
	};
}

// Registration
export const createUser = async (req: Request, res: Response) => {
	try {
		const {
			firstName,
			lastName,
			fatherName,
			email,
			psw,
			birthDate,
			role,
			status,
		} = req.body;

		const checkUser = await User.findOne({ email });

		if (checkUser) {
			return res.status(400).json({
				message: 'Пользователь с таким email уже существует',
			});
		}

		const hashedPsw = await bcrypt.hash(psw, 10);

		//Joining name in one fullname
		const fullname = [lastName, firstName, fatherName]
			.filter(Boolean)
			.join(' ');

		const newUser = new User({
			fullname,
			email,
			password: hashedPsw,
			birth: birthDate,
			status: status || 'active',
			role: role || 'user',
		});

		await newUser.save();

		const { password, ...userData } = newUser.toObject();
		res.status(201).json(userData);
	} catch (e) {
		if (e instanceof Error) {
			res
				.status(500)
				.json({ message: `Ошибка во время регистрации ${e.message}` });
		} else {
			res.status(400).json({ message: 'Ошибка во время регистрации', e });
		}
	}
};

// login
export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, psw } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		const isExist = await bcrypt.compare(psw, user.password);
		if (!isExist) {
			return res.status(400).json({ message: 'Неверный пароль' });
		}

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error('JWT_SECRET is not defined');
		}

		const token = jwt.sign({ id: user._id, role: user.role }, secret, {
			expiresIn: '30d',
		});

		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		res.json({
			user: {
				id: user._id,
				fullname: user.fullname,
				role: user.role,
			},
		});
	} catch (e) {
		console.error('Login error:', e);
		res.status(500).json({
			message: 'Ошибка сервера при входе',
			error: e instanceof Error ? e.message : 'Unknown error',
		});
	}
};

// Получение пользователей

export const getUsers = async (req: any, res: Response) => {
	try {
		const filter = req.user.role === 'admin' ? {} : { _id: req.user.id };

		const users = await User.find(filter);
		res.json(users);
	} catch (e) {
		res.status(500).json({ message: 'Ошибка доступа' });
	}
};

export const logoutUser = (req: Request, res: Response) => {
	res.clearCookie('token');
	res.json({ message: 'Вышли из системы' });
};

export const getUserById = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
		// Проверяем, валидный ли это ObjectId, чтобы сервер не упал
		if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Некорректный формат ID' });
		}

		if (req.user?.role !== 'admin' && req.user?.id !== id) {
			return res.status(403).json({
				message:
					'Доступ запрещен. Вы можете просматривать только свой профиль.',
			});
		}

		const user = await User.findById(id);
		if (!user)
			return res.status(404).json({ message: 'Пользователь не найден' });

		res.json(user);
	} catch (e) {
		res.status(500).json({ message: 'Ошибка поиска' });
	}
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: 'Не авторизован' });
	}

	if (req.user.role !== 'admin') {
		return res
			.status(403)
			.json({ message: 'Доступ запрещен. Только для администраторов.' });
	}
	try {
		const { id } = req.params;

		if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Некорректный формат ID' });
		}

		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		user.status = user.status === 'active' ? 'disable' : 'active';
		await user.save();

		res.json(user);
	} catch (e) {
		res.status(500).json({ message: 'Ошибка при изменении статуса' });
	}
};

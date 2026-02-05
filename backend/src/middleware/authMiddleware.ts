import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const protect = (req: any, res: any, next: any) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Не авторизован' });
	}

	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error('JWT не найден');
	}

	try {
		const decoded = jwt.verify(token, secret) as any;
		req.user = decoded;
		next();
	} catch (e) {
		res.status(401).json({ message: 'Токен не валиден' });
	}
};

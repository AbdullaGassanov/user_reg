import { Schema, model } from 'mongoose';

const userSchema = new Schema(
	{
		fullname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ['admin', 'user'], default: 'user' },
		status: { type: String, default: 'active' },
		birth: { type: String },
	},
	{ timestamps: true },
);

export const User = model('User', userSchema);

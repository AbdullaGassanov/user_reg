export type UserRole = 'admin' | 'user';

export interface User {
	id: string;
	name: string;
	birth: string;
	email: string;
	role: UserRole;
	status: string;
}

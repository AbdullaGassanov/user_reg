import { useState } from 'react';
import Login from './Login';
import UsersList from './UsersList';

import type { UserRole } from '../types';

const AppUsers = () => {
	const [authorized, setAuthorized] = useState<boolean>(false);

	const [role, setRole] = useState<UserRole>('admin');

	return (
		<>
			<header className='header'>Управление пользователями</header>
			<div className='main'>
				{!authorized ? (
					<Login onSetAuth={setAuthorized} onSetRole={setRole} />
				) : (
					<UsersList role={role} onSetAuth={setAuthorized} />
				)}
			</div>
		</>
	);
};

export default AppUsers;

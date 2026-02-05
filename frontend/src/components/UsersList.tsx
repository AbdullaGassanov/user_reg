/* import 'User' from '../types/types' */
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import axios from 'axios';
import type { UserRole } from '../types';

interface UserData {
	_id: string;
	fullname: string;
	birth: string;
	email: string;
	role: UserRole;
	status: string;
}

interface FormGroupProps {
	setUsers: Dispatch<SetStateAction<UserData[]>>;
}

const FormGroup = ({ setUsers }: FormGroupProps) => {
	const [searchId, setSearchId] = useState('');

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!searchId.trim()) {
			return;
		}

		try {
			const response = await axios.get(`/api/users/${searchId.trim()}`, {
				withCredentials: true,
			});

			// Если пользователь найден, заменяем весь список одним этим пользователем
			setUsers([response.data]);
		} catch (e) {
			console.error('Поиск не удался', e);
			alert('Пользователь с таким ID не найден');
		}
	};

	return (
		<form className='users__form' onSubmit={handleSearch}>
			<h2>Поиск пользователя по ID</h2>
			<div className='users__form-group'>
				<input
					type='text'
					className='user__form-txt'
					placeholder='Введите полный ID'
					value={searchId}
					onChange={(e) => setSearchId(e.target.value)}
				/>
				<button type='submit' className='users__form-btn'>
					🔍
				</button>
			</div>
		</form>
	);
};

const Table = ({
	role,
	users,
	setUsers,
}: {
	role: UserRole;
	users: UserData[];
	setUsers: Dispatch<SetStateAction<UserData[]>>;
}) => {
	const isAdmin = role === 'admin';
	const rowClass = `users__table-row ${isAdmin ? 'users__table-row--extended' : ''}`;

	const handleToggleStatus = async (userId: string) => {
		try {
			const response = await axios.patch(
				`/api/users/toggle/${userId}`,
				{},
				{ withCredentials: true },
			);

			// Обновляем состояние в React, чтобы интерфейс изменился мгновенно
			setUsers((prevUsers) =>
				prevUsers.map((u) =>
					u._id === userId ? { ...u, status: response.data.status } : u,
				),
			);
		} catch (e) {
			console.error('Не удалось изменить статус', e);
			alert('Ошибка при блокировке');
		}
	};

	return (
		<section className='users-container'>
			<h5 className='users__title'>Список пользователей</h5>
			<div className='users__table'>
				{/* Рендерим шапку отдельно */}
				<ul className={rowClass}>
					{['ID', 'ФИО', 'Дата рождения', 'Email', 'Роль', 'Статус'].map(
						(head) => (
							<li key={head} className='users__table-hd-item'>
								{head}
							</li>
						),
					)}
					{isAdmin && <li className='users__table-hd-item'>Блокировка</li>}
				</ul>

				{/* Рендерим строки данных через цикл */}
				{users.map((user) => (
					<ul className={rowClass} key={user._id}>
						<li className='users__table-row-item'>{user._id}</li>
						<li className='users__table-row-item'>{user.fullname}</li>
						<li className='users__table-row-item'>{user.birth || '-'}</li>
						<li className='users__table-row-item'>{user.email}</li>
						<li className='users__table-row-item'>{user.role}</li>
						<li className='users__table-row-item'>{user.status}</li>
						{isAdmin && (
							<li className='users__table-row-item'>
								<button
									type='button'
									className={`btn-delete ${user.status === 'disable' ? 'btn-active' : ''}`}
									onClick={() => handleToggleStatus(user._id)}
								>
									{user.status === 'active' ? 'Блок' : 'Разблок'}
								</button>
							</li>
						)}
					</ul>
				))}
			</div>
		</section>
	);
};
/* 
const UsersList = ({
	role,
	onSetAuth,
}: {
	role: UserRole;
	onSetAuth: Dispatch<SetStateAction<boolean>>;
}) => {
	const [users, setUsers] = useState<UserData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);

				const response = await axios.get('/api/users', {
					withCredentials: true,
				});

				setUsers(response.data);
			} catch (e) {
				console.error('Ошибка загрузки:', e);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (loading) return <div className='center-text'>Загрузка данных...</div>;

	return (
		<div className='users'>
			<FormGroup setUsers={setUsers} />
			<Table setUsers={setUsers} role={role} users={users} />
			<div className='center-text'>
				<button
					type='button'
					className='btn'
					onClick={async () => {
						await axios.post(
							'/api/users/logout',
							{},
							{ withCredentials: true },
						);
						onSetAuth(false);
					}}
				>
					Выйти
				</button>
			</div>
	
		</div>
	);
}; */

const UsersList = ({
	role,
	onSetAuth,
}: {
	role: UserRole;
	onSetAuth: Dispatch<SetStateAction<boolean>>;
}) => {
	const [users, setUsers] = useState<UserData[]>([]);
	const [loading, setLoading] = useState(true);

	// Функция для сброса поиска (чтобы вернуть всех пользователей)
	const refreshUsers = async () => {
		try {
			setLoading(true);
			const response = await axios.get('/api/users', { withCredentials: true });
			setUsers(response.data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshUsers();
	}, []);

	if (loading) return <div className='center-text'>Загрузка данных...</div>;

	return (
		<div className='users'>
			{/* Передаем функцию управления списком в поиск */}
			<FormGroup setUsers={setUsers} />

			{/* Кнопка "Показать всех", если мы что-то отфильтровали поиском */}
			<div style={{ textAlign: 'center', marginBottom: '10px' }}>
				<button
					onClick={refreshUsers}
					style={{ cursor: 'pointer', fontSize: '12px' }}
				>
					Показать всех пользователей
				</button>
			</div>

			{/* Передаем функцию управления списком в таблицу (для кнопки Блок) */}
			<Table role={role} users={users} setUsers={setUsers} />

			<div className='center-text'>
				<button
					type='button'
					className='btn'
					onClick={async () => {
						await axios.post(
							'/api/users/logout',
							{},
							{ withCredentials: true },
						);
						onSetAuth(false);
					}}
				>
					Выйти
				</button>
			</div>
		</div>
	);
};

export default UsersList;

import type { Dispatch, SetStateAction, ReactNode } from 'react';
import { useState } from 'react';
import type { UserRole } from '../types';
import axios, { isAxiosError } from 'axios';

const FormTabs = ({ children }: { children: ReactNode }) => {
	return <div className='form__tabs'>{children}</div>;
};

type TabsActive = 'reg-tab' | 'enter-tab';

const Form = ({ onSetAuth, onSetRole }: LoginProps) => {
	const [activeTab, setActive] = useState<TabsActive>('reg-tab');
	const [isRegistered, setIsRegistered] = useState<boolean>(false);

	const isReg = activeTab === 'reg-tab';

	const [selectedRole, setSelectedRole] = useState<UserRole>('user');

	const handleReg = () => {
		setActive('reg-tab');
	};

	const handleEnter = () => {
		setActive('enter-tab');
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());

		try {
			if (isReg) {
				// РЕГИСТРАЦИЯ
				await axios.post('/api/users/register', data);
				setIsRegistered(true);
			} else {
				// ВХОД
				const response = await axios.post('/api/users/login', data, {
					withCredentials: true,
				});

				onSetRole(response.data.user.role);
				onSetAuth(true);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				const message = error.response?.data?.message || error.message;
				console.error('Ошибка при отправке:', message);
				alert(message);
			} else {
				console.error('Непредвиденная ошибка:', error);
				alert('Что-то пошло не так');
			}
		}
	};

	return (
		<div className='login-container'>
			{isRegistered ? (
				<div className='success-message'>
					<h2 style={{ marginBottom: '15px' }}>Регистрация успешна! 😍</h2>
					<p style={{ marginBottom: '20px' }}>
						Теперь вы можете войти в систему.
					</p>
					<button
						type='button'
						className='btn'
						onClick={() => {
							setIsRegistered(false);
							setActive('enter-tab');
						}}
					>
						Перейти ко входу
					</button>
				</div>
			) : (
				<form className='form' action='#' id='form' onSubmit={handleSubmit}>
					<FormTabs>
						<button
							type='button'
							className={`form__btn form__btn-reg ${isReg ? 'tab-active' : ''}`}
							onClick={handleReg}
						>
							<span> Регистрация</span>
						</button>
						<button
							type='button'
							className={`form__btn form__btn-enter ${!isReg ? 'tab-active' : ''}`}
							onClick={handleEnter}
						>
							Вход
						</button>
					</FormTabs>
					<h4 className='login__title'>{isReg ? 'Регистрация' : 'Вход'}</h4>
					{isReg ? (
						<>
							<div className='form__data'>
								<div className='form__group'>
									<label htmlFor='input-lastname'>Фамилия</label>
									<input
										type='text'
										id='input-lastname'
										name='lastName'
										required
									/>
								</div>
								<div className='form__group'>
									<label htmlFor='input-name'>Имя</label>
									<input
										type='text'
										id='input-name'
										name='firstName'
										required
									/>
								</div>
								<div className='form__group'>
									<label htmlFor='input-fname'>Отчество</label>
									<input type='text' id='input-fname' name='fatherName' />
								</div>
								<div className='form__group'>
									<label htmlFor='birth-data'>Дата Рождения</label>
									<input type='date' id='birth-data' name='birthDate' />
								</div>
								<div className='form__group'>
									<label htmlFor='email'>Email</label>
									<input type='text' id='email' name='email' required />
								</div>
								<div className='form__group'>
									<label htmlFor='psw'>Пароль</label>
									<input type='text' id='psw' name='psw' required />
								</div>

								{isReg && (
									<div className='form__group'>
										<label htmlFor='role'>Роль</label>
										<select
											className='form__select'
											id='role'
											name='role'
											value={selectedRole}
											onChange={(e) =>
												setSelectedRole(e.target.value as UserRole)
											}
											required
										>
											<option value='admin'>admin</option>
											<option value='user'>user</option>
										</select>
									</div>
								)}

								<div className='form__group'>
									<label htmlFor='status'>Статус</label>
									<select className='form__select' id='status' name='status'>
										<option value='active'>Активен</option>
										<option value='disable'>Отключен</option>
									</select>
								</div>
							</div>
							<button type='submit' className='btn'>
								Регистрация
							</button>
						</>
					) : (
						<>
							<div className='form__data'>
								<div className='form__group'>
									<label htmlFor='email'>Email</label>
									<input type='text' id='email' name='email' />
								</div>
								<div className='form__group'>
									<label htmlFor='psw'>Пароль</label>
									<input type='text' id='psw' name='psw' />
								</div>
							</div>
							<button type='submit' className='btn'>
								Вход
							</button>
						</>
					)}
				</form>
			)}
		</div>
	);
};

interface LoginProps {
	onSetAuth: Dispatch<SetStateAction<boolean>>;
	onSetRole: Dispatch<SetStateAction<UserRole>>;
}

const Login = ({ onSetAuth, onSetRole }: LoginProps) => {
	return (
		<section className='login'>
			<Form onSetAuth={onSetAuth} onSetRole={onSetRole} />
		</section>
	);
};

export default Login;

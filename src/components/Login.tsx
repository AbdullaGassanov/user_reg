const Login = () => {
	return (
		<section className='login'>
			<form className='form' action='#' id='form'>
				<h3 className='login__title'>Регистрация пользователя</h3>

				<div className='form__group'>
					<label htmlFor='input-lastname'>Фамилия</label>
					<input type='text' id='input-lastname' name='input-lastname' />
				</div>
				<div className='form__group'>
					<label htmlFor='input-name'>Имя</label>
					<input type='text' id='input-name' name='input-name' />
				</div>
				<div className='form__group'>
					<label htmlFor='email'>Email</label>
					<input type='text' id='email' name='email' />
				</div>
				<div className='form__group'>
					<label htmlFor='psw'>Пароль</label>
					<input type='text' id='psw' name='psw' />
				</div>
				<div className='form__group'>
					<label htmlFor='role'>Роль</label>
					<select className='form__select' id='role' name='role'>
						<option>admin</option>
						<option>user</option>
					</select>
				</div>
				<button className='btn'>Регистрация</button>
			</form>
		</section>
	);
};

export default Login;

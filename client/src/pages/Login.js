import { useState } from 'react';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import { signIn } from '../util/signIn';
import { currentUrl } from '../index';

function Login({ login }) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function loginUser(e) {
		if (email === '' || password === '') return;
		const _signIn = await signIn(login.supabase, email, password);
		if (!_signIn.error) window.location.replace(`${currentUrl}`);
	}

	return (
		<div className='container column'>
			<div className='mid'>
				<div className="footer set-username">
					<div className='titles'>
						<img src='imgs/logo.png' />
						<span className='title'>Login</span>
					</div>
					<input placeholder='Email' type='text' className='input' onKeyDown={async (e) => {
						if (e.key === 'Enter' || e.key === 'NumpadEnter') await loginUser(e);
					}} onChange={async (e) => {
						e.preventDefault();
						setEmail(e.target.value);
					}} />
					<input placeholder='Password' type='password' className='input' onKeyDown={async (e) => {
						if (e.key === 'Enter' || e.key === 'NumpadEnter') await loginUser(e);
					}} onChange={async (e) => {
						e.preventDefault();
						setPassword(e.target.value);
					}} />
					<div className='button' onClick={async (e) => {
						await loginUser(e);
					}}>Start talking <HiOutlineArrowSmRight /></div>
				</div>
				<span className='warning'>Don't have an account yet? <a className='link' href='/register'>Register</a>.</span>
			</div>
		</div>
	);
}

export default Login;
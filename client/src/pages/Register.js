import { useState } from 'react';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import { signUp } from '../util/signUp';
import { currentUrl } from '../index';

function Register({ login }) {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function registerUser(e) {
		if (name === '' || email === '' || password === '') return;
		const avatar = Math.floor(Math.random() * 6) + 1;
		const _signUp = await signUp(login.supabase, email, password, name, avatar);
		if (!_signUp.error) window.location.replace(`${currentUrl}`);
	}

	return (
		<div className='container column'>
			<div className='mid'>
				<div className="footer set-username">
					<div className='titles'>
						<img src='imgs/logo.png' />
						<span className='title'>Register</span>
					</div>
					<input placeholder='Username' type='text' className='input' onKeyDown={async (e) => {
						if (e.key === 'Enter' || e.key === 'NumpadEnter') await registerUser(e);
					}} onChange={async (e) => {
						e.preventDefault();
						setName(e.target.value);
					}} />
					<input placeholder='Email' type='text' className='input' onKeyDown={async (e) => {
						if (e.key === 'Enter' || e.key === 'NumpadEnter') await registerUser(e);
					}} onChange={async (e) => {
						e.preventDefault();
						setEmail(e.target.value);
					}} />
					<input placeholder='Password' type='password' className='input' onKeyDown={async (e) => {
						if (e.key === 'Enter' || e.key === 'NumpadEnter') await registerUser(e);
					}} onChange={async (e) => {
						e.preventDefault();
						setPassword(e.target.value);
					}} />
					<div className='button' onClick={async (e) => {
						await registerUser(e);
					}}>Start talking <HiOutlineArrowSmRight /></div>
				</div>
				<span className='warning'>Have an account already? <a className='link' href='/login'>Login</a>.</span>
			</div>
		</div>
	);
}

export default Register;
import { useEffect, useRef, useState } from 'react';
import { BsFillCircleFill, BsFillSendFill } from 'react-icons/bs';
import { MdLogout } from 'react-icons/md';
import { io } from 'socket.io-client';
import { signOut } from '../util/signOut';
import { currentUrl } from '../index';

function Chat({ login }) {

	const dev = window.location.origin.startsWith('http://localhost:');

	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState(0);

	const [username, setUsername] = useState(login.name);
	const [userId, setUserId] = useState(login.userId);

	const chatEndRef = useRef();
	const [chat, setChat] = useState([]);
	const [isTyping, setIsTyping] = useState({});

	useEffect(() => {
		chatEndRef.current?.scrollIntoView();
	}, [chat, isTyping]);

	useEffect(() => {
		setUsername(login.name);
		setUserId(login.userId);
		if (login.userId) setChat([{ avatar: '/elon_musk', id: 0, user: 'Elon Musk', text: `Welcome ${login.name}!`, bot: true, timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true, minute: '2-digit' }) }]);
	}, [login]);

	const [timer, setTimer] = useState({});
	const [message, setMessage] = useState('');

	function sendMessage(bot) {

		if ((message && message !== '' && message.replaceAll(' ','') !== '') || bot) {

			const msg = { avatar: bot ? '/elon_musk' : `/avatars/${login.avatar}`, id: bot ? 0 : userId, user: bot ? 'Elon Musk' : username, text: bot ? bot : message, bot: bot ? true : false, avoid: userId, timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true, minute: '2-digit' }) };
			setChat(chat.concat([msg]));
			socket?.emit('send-message', msg);

			if (!bot) {
				setMessage('');
				socket?.emit('stop-typing', { id: userId, name: username });
			}
		}
	}

	useEffect(() => {

		const _socket = io(dev ? 'ws://localhost:3005' : 'https://wsocket.deezcord.xyz');
		_socket?.on('connect', () => {
			setSocket(_socket);
		});

		return () => {
			_socket?.disconnect();
		};

	}, []);

	useEffect(() => {

		if (!userId) return;

		socket?.timeout(2000)?.emit('get-data', '');

		socket?.on('online-users', (online) => {
			setOnlineUsers(online);
		});

		socket?.on('new-message', (msg) => {
			if (!msg.avoid || msg.avoid !== userId) setChat(chat.concat([{ ...msg, timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true, minute: '2-digit' }) }]));
		});

		socket?.on('user-start-typing', (usr) => {
			if (usr.id !== userId && !isTyping?.id) setIsTyping(usr);
		});

		socket?.on('user-stop-typing', (usr) => {
			if (isTyping && usr.id === isTyping?.id) setIsTyping({});
		});

	}, [socket, chat, userId, isTyping]);

	return (
		<div className='container'>
			<div className="chat-box">
				<div className="header">
					<div className='chat-title'>
						<span>Global Chat</span>
						<div className='description'><BsFillCircleFill className='online-icon' />{onlineUsers.toLocaleString()} Online</div>
					</div>
					<MdLogout className='logout' onClick={(async () => {
						await signOut(login.supabase);
						window.location.replace(`${currentUrl}/login`);
					})} />
				</div>
				<div className='chat-container'>
					<div className='chat'>
						{chat.map((m, i) => { const checkSameMsg = i-1 >= 0 && chat[i-1].id === m.id; return(
							<div key={i} className={`msg-group ${m.id === userId ? 'right secondary' : 'left primary'}${checkSameMsg ? ' same-user-group' : ''}`}>
								{m.id !== userId && <div className='avatar-cont'><img draggable={false} className='avatar' src={`imgs${m.avatar}.png`.replace('03','01')} /></div>}
								<div key={i} className={`message${checkSameMsg ? ' same-user' : ''}`}>
									{checkSameMsg ? <></> : <div className='username'>
										<span className='user'>{m.user}</span>
										{m.bot && <div className='bot-badge'>
											<span>BOT</span>
										</div>}
									</div>}
									<div className='text'>
										<span>{m.text}</span>
										<span className='timestamp'>{m.timestamp}</span>
									</div>
								</div>
							</div>
						);})}
						{isTyping?.id && <div className={'typing'}>{isTyping?.name} is typing...</div>}
					</div>
					<div ref={chatEndRef} />
				</div>
				<div className='footer'>
					<input name='global-chat-input' placeholder='Message in Global Chat' value={message} type='text' className='input' onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === 'NumpadEnter') sendMessage();
					}} onChange={(e) => {
						e.preventDefault();
						setMessage(e.target.value === '' ? null : e.target.value);
						clearTimeout(timer);
						socket?.emit('start-typing', { id: userId, name: username });
						setTimer(setTimeout(() => {
							socket?.emit('stop-typing', { id: userId, name: username });
						}, 2000));
					}} />
					<div className={`button${!(message && message !== '' && message.replaceAll(' ','') !== '') ? ' disabled' : ''}`} onClick={() => sendMessage()}><BsFillSendFill /></div>
				</div>
			</div>
		</div>
	);
}

export default Chat;
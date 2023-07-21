import { useEffect, useState } from 'react';
import { BsFillCircleFill, BsFillSendFill } from 'react-icons/bs';
import { BiCheck } from 'react-icons/bi';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import { io } from 'socket.io-client';

function App() {

	const dev = window.location.origin.startsWith('http://localhost:');

	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState(0);

	const [username, setUsername] = useState('');
	const [userId, setUserId] = useState('');
	const [startChatting, setStartChatting] = useState(false);

	const [timer, setTimer] = useState(null);
	const [isTyping, setIsTyping] = useState(null);

	const [message, setMessage] = useState('');
	const [chat, setChat] = useState([
		{ id: 0, user: 'Elon Musk', text: 'Welcome to Deezcord!', bot: true, timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true, minute: '2-digit' }) }
	]);

	function sendMessage(bot) {

		if ((message && message !== '' && message.replaceAll(' ','') !== '') || bot) {
			const msg = { id: bot ? 0 : userId, user: bot ? 'Elon Musk' : username, text: bot ? bot : message, bot: bot ? true : false, avoid: userId, timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true, minute: '2-digit' }) };
			setChat(chat.concat([msg]));
			socket?.emit('send-message', msg);
			if (!bot) {
				setMessage('');
				if (isTyping?.id === userId) socket?.emit('stop-typing', { id: userId, name: username });
			}
		}
	}

	useEffect(() => {
		const _socket = io(dev ? 'ws://localhost:3005' : 'https://wsocket.deezcord.xyz');
		_socket.on('connect', () => {
			setSocket(_socket);
			setUserId(_socket.id);
		});
		return () => {
			_socket.disconnect();
		};
	}, []);

	useEffect(() => {

		socket?.on('online-users', (online) => {
			setOnlineUsers(online);
		});

		socket?.on('new-message', (msg) => {
			if (!msg.avoid || msg.avoid !== userId) setChat(chat.concat([{ ...msg, timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true, minute: '2-digit' }) }]));
		});

		socket?.on('user-start-typing', (usr) => {
			setIsTyping(usr);
		});

		socket?.on('user-stop-typing', () => {
			setIsTyping(null);
		});

	}, [socket, chat, userId]);

	return (
		<div className='container'>
			{(!username && !userId) || !startChatting
				? <div className="footer set-username">
					<input placeholder='Username' type='text' className='input' onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === 'NumpadEnter') setStartChatting(true);
					}} onChange={(e) => {
						e.preventDefault();
						setUsername(e.target.value);
					}} />
					<div className='button' onClick={() => {
						setStartChatting(true);
						socket?.timeout(1000).emit('join', '');
					}}><HiOutlineArrowSmRight /></div>
				</div>
				: <div className="chat-box">
					<div className="header">
						<div className='chat-title'>
							<span>Global Chat</span>
							<div className='description'><BsFillCircleFill className='online-icon' />{onlineUsers.toLocaleString()} Online</div>
						</div>
					</div>
					<div className='chat-container'>
						<div className='chat'>
							{chat.map((m, i) => { return(
								<div key={i} className={`message ${m.id === userId ? 'right secondary' : 'left primary'}${(i-1 >= 0 && chat[i-1].id === m.id) ? ' same-user' : ''}`}>
									{(i-1 >= 0 && chat[i-1].id === m.id) ? <></> : <div className='username'>
										<span className='user'>{m.user}</span>
										{m.bot && <div className='bot-badge'>
											<BiCheck className='icon'/>
											<span>BOT</span>
										</div>}
									</div>}
									<div className='text'>
										<span>{m.text}</span>
										<span className='timestamp'>{m.timestamp}</span>
									</div>
								</div>
							);})}
							<div className={`typing${!(isTyping && isTyping?.id !== userId) ? ' invisible' : ''}`}>{isTyping?.name} is typing...</div>
						</div>
					</div>
					<div className='footer'>
						<input placeholder='Message Global Chat' value={message} type='text' className='input' onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === 'NumpadEnter') sendMessage();
						}} onChange={(e) => {
							e.preventDefault();
							setMessage(e.target.value === '' ? null : e.target.value);
							clearTimeout(timer);
							if (isTyping?.id !== userId && !isTyping) socket?.emit('start-typing', { id: userId, name: username });
							setTimer(setTimeout(() => {
								if (isTyping?.id === userId) socket?.emit('stop-typing', { id: userId, name: username });
							}, 2000));
						}} />
						<div className={`button${!(message && message !== '' && message.replaceAll(' ','') !== '') ? ' disabled' : ''}`} onClick={() => sendMessage()}><BsFillSendFill /></div>
					</div>
				</div>
			}
		</div>
	);
}

export default App;

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Redirect from './components/Redirect';
import { getSupabase } from './util/getSupabase';
import { getSession } from './util/getSession';

// Import Pages

import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';

// Set Routes

function App() {

	// Get Supabase

	const [supabase, setSupabase] = useState('loading');
	useEffect(() => {
		async function _getSupabase() {
			setSupabase(await getSupabase());
		}
		_getSupabase();
	}, []);

	// Get Session

	const [session, setSession] = useState('loading');
	useEffect(() => {
		async function _getSession() {
			setSession(await getSession(supabase));
		}
		if (supabase !== 'loading') _getSession();
	}, [supabase]);

	// Login Settings

	const loginSettings = {
		supabase,
		session,
		userId: session?.user?.id,
		name: session?.user?.name || 'Unknown User',
		avatar: session?.user?.avatar || 'avatar_01'
	};

	// Check Login

	const [isLogged, setIsLogged] = useState((localStorage.getItem('logged') || 'true') === 'true' ? true : false);

	useEffect(() => {
	    if (!session) {
			localStorage.setItem('logged', 'false');
			setIsLogged(false);
		}
	}, [session]);

	// Set Pages

	const pages = [
		{ url: 'login', element: <Login login={loginSettings} />, needsLogout: true },
		{ url: 'register', element: <Register login={loginSettings} />, needsLogout: true },
		{ url: '', element: <Chat login={loginSettings} />, needsLogin: true }
	];

	// Render

	const helmetContext = {};
	return (
		<HelmetProvider context={helmetContext}>
			<Router>
				<Routes>
					{pages.map((p, i) => { return(
						<Route key={i} path={`/${p.url}`} element={!p.element
							? <Redirect page={p.redirect} />
							: isLogged && p.needsLogin
								? p.element
								: p.needsLogout
									? isLogged
										? <Redirect page={''} />
										: p.element
									: <Redirect page={'login'} />} />
					);})}
				</Routes>
			</Router>
		</HelmetProvider>
	);
}

export default App;
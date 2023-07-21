import { currentUrl } from '../index';

export async function signUp(supabase, email, password, name, avatar) {
	const { data, error } = await supabase?.auth?.signUp({
		email: email,
		password: password,
		options: {
			data: {
				name: name,
				avatar: `avatar_0${avatar}`
			},
			emailRedirectTo: `${currentUrl}/`
		}
	});
	if (!error) localStorage.setItem('logged', 'true');
	return { data, error };
}
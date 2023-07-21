export async function signIn(supabase, email, password) {
	const { data, error } = await supabase?.auth?.signInWithPassword({
		email: email,
		password: password
	});
	if (!error) localStorage.setItem('logged', 'true');
	return { data, error };
}
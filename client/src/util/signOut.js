export async function signOut(supabase) {
	const { error } = await supabase?.auth?.signOut();
	if (!error) {
		localStorage.setItem('logged', 'false');
		return true;
	}
	else return false;
}
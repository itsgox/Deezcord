export async function getSession(supabase) {

	if (!supabase) return null;
	const { data } = await supabase?.auth?.getSession();

	if (data.session) {
		const sessionData = {
			user: {
				id: data.session.user.id,
				email: data.session.user.email,
				name: `${data.session.user.user_metadata.name}`,
				avatar: data.session.user.user_metadata.avatar
			}
		};
		return sessionData;
	}
	else return null;
}
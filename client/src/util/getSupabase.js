import { createClient } from '@supabase/supabase-js';

async function getSupabase() {

	const projectUrl = 'https://uwmmmqcyjoeeuzeowump.supabase.co';
	const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bW1tcWN5am9lZXV6ZW93dW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk5MzgyMjYsImV4cCI6MjAwNTUxNDIyNn0.wHhellq_gLgGce9wpqtdd2afSy2nipbYz8jGFxv_lZE';

	return createClient(
		projectUrl,
		anonKey
	);
}

export { getSupabase };
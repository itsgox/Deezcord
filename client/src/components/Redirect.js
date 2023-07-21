import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = memo(({ page }) => {

	const navigate = useNavigate();
	useEffect(() => {
		navigate(`/${page}`);
	}, []);
});

export default Redirect;
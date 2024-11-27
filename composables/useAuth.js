export const useAuth = () => {
	const authUser = useAuthUser();
	const isAuthenticating = ref(false);

	const isAuthenticated = computed(() => {
		const authToken = localStorage.getItem('authToken');
		const meUser = localStorage.getItem('isUserSet');
		return authToken !== null &&
			authToken !== 'null' &&
			authToken !== '' &&
			authToken !== 'undefined' &&
			authToken !== undefined &&
			meUser === 'true';
	});

	const setUser = (user) => {
		if (process.client && user && user.accessToken) {
			localStorage.setItem('authToken', user.accessToken);
		}
		authUser.value = user;  // Esto actualiza el estado directamente
		useCryptoStore().userBalance = user?.balance || 0.00;
	};

	const login = async ({wallet}) => {
		console.log('🔐 Starting authentication process...');
		isAuthenticating.value = true;

		try {
			console.log('📡 Making login request...');
			const {error, data} = await useBaseFetch('/users/authenticate', {
				method: 'POST',
				body: {wallet},
			});

			if (!error.value) {
				console.log('✅ Login successful, setting user data');
				setUser(data.value.data);
				localStorage.setItem('authToken', data.value.token);
			} else {
				console.error('❌ Login failed:', error.value);
			}

			return {error, data};
		} finally {
			isAuthenticating.value = false;
		}
	};

	const me = async () => {
		console.log('👤 Fetching user profile...');
		try {
			const token = localStorage.getItem('authToken');
			if (token && token !== 'null' && token !== 'undefined' && token !== '') {
				console.log('🎫 Valid token found, making request...');
				const {error, data} = await useBaseFetch('/users/me', {
					method: 'GET',
					headers: [
						['Authorization', `Bearer ${token}`]
					],
				});

				if (!error.value) {
					console.log('✅ Profile data retrieved successfully');
					setUser(data.value.data);
					localStorage.setItem('isUserSet', 'true');
					return data.value.data;
				} else {
					console.error('❌ Failed to fetch profile:', error.value);
				}
			} else {
				console.warn('⚠️ No valid token found for profile fetch');
			}
		} catch (error) {
			console.error('❌ Error fetching profile:', error);
		}
		return authUser;
	};
	const logout = async () => {
		// TODO: Check how to use cookies instead of localStorage
		if (process.client) localStorage.setItem('authToken', null);
		if (process.client) localStorage.setItem('isUserSet', null);
		setUser(false);

		navigateTo('/');
	};


	return {
		login,
		isAuthenticated,
		logout,
		me,
		setUser,
		isAuthenticating
	};
};

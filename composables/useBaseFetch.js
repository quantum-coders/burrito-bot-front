export const useBaseFetch = (request, opts = {}) => {
	const config = useRuntimeConfig();
	console.log("apiURL", config.public.apiURL);
	const baseOpts = {baseURL: config.public.apiURL, ...opts};

	// If user is logged in, add token to headers
	const token = localStorage.getItem('authToken');

	if (token) {
		if (token) baseOpts.headers = [['Authorization', `Bearer ${token}`]];
	}

	return useFetch(request, baseOpts);
};

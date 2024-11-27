module.exports = {
	apps: [
		{
			name: 'paige-front',
			port: '1555',
			exec_mode: 'cluster',
			instances: 1,
			script: './.output/server/index.mjs',
		},
	],
};

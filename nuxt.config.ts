export default defineNuxtConfig({
	css: [],
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	extends: [ '@thewebchimp/chimp-nuxt-layer' ],
	modules: [ '@nuxtjs/google-fonts', 'nuxt-swiper', '@nuxtjs/device' ],
	googleFonts: {
		families: {}
	},
	app: {
		head: {
			title: 'Burrito Agent',
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap'
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap'
				},
			],
		},
	},
	imports: { dirs: [ 'stores' ] },
	runtimeConfig: {
		public: {
			apiURL: process.env.BASE_URL || 'http://localhost:1337',
			appURL: process.env.APP_URL || 'http://localhost:3000',
		},
	},
	vite: {
		define: { global: 'window' },
	}
})

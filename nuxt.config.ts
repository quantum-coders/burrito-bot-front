export default defineNuxtConfig({
    css: [],
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    extends: ['@thewebchimp/chimp-nuxt-layer'],
    modules: ['@nuxtjs/google-fonts', 'nuxt-swiper', '@nuxtjs/device'],
    googleFonts: {
        families: {}
    },
    app: {
        head: {
            title: 'Burrito Agent',
            link: [
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
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
    imports: {dirs: ['stores']},
    runtimeConfig: {
        public: {
            apiURL: process.env.BASE_URL || 'http://localhost:1337',
            appURL: process.env.APP_URL || 'http://localhost:3000',
            clientURL: process.env.CLIENT_URL || 'https://burritoai.finance',
            burritoTokenAddress: process.env.BURRITO_TOKEN_ADDRESS || '0xf65645a42609f6b44E2EC158A3Dc2b6CfC97093f',
            usdtAddress: process.env.USDT_ADDRESS || '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
            chainId: process.env.CHAIN_ID || '43114',
            network: process.env.NETWORK || 'mainnet',
        },
    },
    vite: {
        define: {global: 'window'},
    }
})

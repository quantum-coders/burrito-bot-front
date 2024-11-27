<template>
	<nuxt-link to="/" class="logo" @mouseenter="changePhrase">
		<img alt="Burrito AI" src="/images/logo.svg" />
		<div class="phrase">
			<span>{{ selectedPhrase }}</span>
		</div>
	</nuxt-link>
</template>

<script setup>

	const phrases = [
	'A burrito a day keeps the FOMO away',
	'AI for the people',
	'Nothing better than a burrito',
	'Spice up your life with AI',
	'BurritoAI: Filling your hunger for unbiased AI',
	'Unwrapping the future, one burrito at a time',
	'AI with a side of extra sauce 🌯🤖',
	'BurritoAI: Where intelligence meets flavor',
	'Too hot to handle, too smart to ignore',
	'Serving you unbiased AI, wrapped in perfection',
	'AI that doesn’t hold back, just like your favorite burrito',
	'Get your daily dose of AI and crypto, all in one burrito 🌯',
	'Your new favorite flavor of innovation',
	'Why settle for basic? Go full BurritoAI',
	'Wrapped with intelligence, seasoned with innovation',
	'Fuel your mind, fill your wallet: BurritoAI',
	'Decentralize your hunger for knowledge with BurritoAI',
	'Taste the future with BurritoAI',
	'BurritoAI: Bold, spicy, and decentralized',
	'Roll into the future with BurritoAI',
	'BurritoAI: Deliciously decentralized',
	'Get wrapped in the future with BurritoAI',
	'Spicy AI for a bold future',
	'BurritoAI: The only burrito you’ll want to stake in',
	'BurritoAI: Tasty on the outside, genius on the inside',
	'BurritoAI: Where flavor meets future',
	'Add a dash of DeFi, and a sprinkle of AI',
	'BurritoAI: Spicy, crunchy, innovative',
	'AI to go? BurritoAI is your fast food for thought',
	'BurritoAI: Satisfy your cravings for decentralized innovation',
	'Feel the flavor of decentralized intelligence with BurritoAI',
	'BurritoAI: Hot, fresh, and ready to disrupt',
	'Unlock the flavor of AI with BurritoAI',
	'BurritoAI: Serving up intelligence, one burrito at a time',
	'Bite into the future with BurritoAI',
	'No fillers, just AI with extra flavor',
	'BurritoAI: Cooking up unbiased conversations',
	'AI that’s not just spicy but unbiased too!',
	'BurritoAI: A tech revolution, wrapped in a tortilla',
	'Get served the best of AI and crypto with BurritoAI',
	'Tortillas and tech: BurritoAI’s secret recipe',
	'No need to unwrap this burrito for decentralized AI',
	'Unleash the power of BurritoAI—one byte at a time!',
	'BurritoAI: The flavor of innovation with a hint of spice',
	'BurritoAI: A smarter bite of blockchain',
	'When AI meets burrito, you get the future served hot',
	'BurritoAI: A feast for your mind and wallet',
	'Bringing AI to your fingertips, wrapped up with crypto',
	'BurritoAI: The most delicious way to decentralize',
	'A tasty revolution in DeFi and AI',
	'BurritoAI: Serving up decentralized brilliance',
	'More than just flavor—experience the AI future with BurritoAI',
	'BurritoAI: Bringing heat to the blockchain with every bite',
	'AI with the perfect wrap of DeFi',
	'Get a taste of tomorrow with BurritoAI today!',
	'BurritoAI: An intelligent revolution wrapped in flavor',
	'Smart, spicy, and ready to disrupt',
	'Let’s taco ‘bout BurritoAI and decentralized innovation',
	'The burrito that powers the future of AI',
	'Crypto and AI: A spicy combo with BurritoAI',
	'Join the future, wrapped and ready with BurritoAI',
	'Serving intelligence with a side of spice—BurritoAI',
	'Unwrap innovation with BurritoAI',
	'The flavor-packed future of decentralized AI',
	'With BurritoAI, intelligence has never tasted so good',
	'BurritoAI: The secret sauce of decentralized intelligence',
	'BurritoAI: When blockchain meets burrito brilliance',
	'Bold AI, spiced with the future',
	'Ready for a flavorful future? BurritoAI is here!',
	'Turn up the heat on innovation with BurritoAI',
];

	const selectedPhrase = ref('');

	const changePhrase = () => {
		selectedPhrase.value = phrases[Math.floor(Math.random() * phrases.length)];
	};

</script>

<style lang="sass" scoped>
	.logo
		width: 30px

		@media (min-width: $sm)
			width: 40px

		&:hover
			.phrase
				span
					left: 45px

		.phrase
			position: absolute
			top: 50%
			overflow: clip
			width: 200px
			transform: translateY(-50%)
			font-size: 0.75rem
			line-height: 1.1
			z-index: 1
			color: $brand1

			@media (min-width: $sm)
				width: 250px
				font-size: 0.875rem

			span
				text-wrap: balance
				display: block
				left: -500px
				width: 150px
				transition: all 500ms ease-in-out

				@media (min-width: $sm)
					width: 200px
		img
			width: 100%
			z-index: 2
</style>

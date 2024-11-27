<template>
	<section class="dashboard flex-grow-1 d-flex align-items-stretch">
		<img class="background-image" src="/images/ai.jpg" alt="">
		<dashboard-sidebar />
		<div class="dashboard-section d-flex flex-column flex-grow-1">
			<nuxt-page />
		</div>
	</section>
</template>

<script setup>
	const dashboard = useDashboard();

	useHead({
		titleTemplate: `${ dashboard.title } - %s`,
	});
</script>

<style lang="sass" scoped>
	.dashboard
		background: var(--brand1)
		background-size: cover

		&:before
			content: ''
			@extend .absolute-full
			background: linear-gradient(90deg, rgba(var(--brand1-rgba), 1), rgba(var(--brand1-rgba), 0))
			z-index: 1
			pointer-events: none

		.background-image
			@extend .absolute-full
			object-fit: cover
			z-index: 0
			pointer-events: none

		.dashboard-sidebar
			z-index: 3

		.dashboard-section
			overflow: hidden
			background: white
			margin: 1rem 1rem 1rem 0
			border-radius: 1rem
			z-index: 3

</style>
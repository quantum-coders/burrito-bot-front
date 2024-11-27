<template>
	<div class="sidebar-brand">
		<div class="collapsed">
			<lazy-svgo-imago />
		</div>
		<div class="open">
			<lazy-svgo-logo />
		</div>
	</div>
</template>

<script setup>
</script>

<style lang="sass" scoped>

	.sidebar-brand
		@extend .flex-center
		height: 64px
		margin-top: 1rem

		.collapsed
			@extend .absolute-full
			@extend .flex-center
			transition: all 0.5s ease-in-out
			opacity: 0

			svg
				width: 30px
				height: auto

				:deep(path)
					fill: white

		.open
			@extend .absolute-full
			@extend .flex-center
			width: var(--dashboard-sidebar-width)
			transition: all 0.5s ease-in-out

			svg
				width: 100px
				height: auto

				:deep(path)
					fill: white

	.is-closed
		.collapsed
			opacity: 1

		.open
			opacity: 0

</style>
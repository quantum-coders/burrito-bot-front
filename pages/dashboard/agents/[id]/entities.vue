<template>
	<section class="d-flex flex-column flex-grow-1">

		<div class="p-4 pb-0 d-flex align-items-start gap-2">
			<p class="mb-0">You can add entities of information that the agent will use to provide information to your users.</p>
			<button class="btn btn-primary text-nowrap" @click="paige.addEntity">Add Entity</button>
		</div>

		<div class="flex-grow-1">
			<div class="scroll-wrapper p-4">
				<nuxt-page />
			</div>
		</div>
	</section>
</template>

<script setup>
	const paige = usePaige();
	const user = useAuthUser();
</script>

<style lang="sass" scoped>
	.entity
		border: 1px solid var(--bs-border-color)
		border-radius: 0.5rem
		margin-bottom: 1rem
		padding: 1rem

		h3
			font-size: 1.25rem

		p
			color: var(--bs-gray)
			margin-bottom: 0
</style>
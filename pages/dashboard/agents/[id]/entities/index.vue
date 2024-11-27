<template>
	<template v-if="paige.agent && paige.agent.entities">
		<template v-for="e in paige.agent.entities">
			<article class="entity">
				<nuxt-link class="entity-link" :to="`/dashboard/agents/${ paige.agent.id }/entities/${ e.id }`"></nuxt-link>
				<h3 class="entity-title">{{ e.name }}</h3>
				<p class="entity-description">{{ e.description }}</p>
			</article>
		</template>
	</template>
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

		.entity-link
			position: absolute
			@extend .absolute-full
			z-index: 2

		.entity-title
			font-size: 1.25rem

		.entity-description
			color: var(--bs-gray)
			margin-bottom: 0
</style>
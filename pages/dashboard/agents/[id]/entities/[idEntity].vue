<template>
	<div class="entity-wrapper">
		<p class="d-flex justify-content-end">
			<nuxt-link
				class="entity-link d-flex gap-2 align-items-center text-decoration-none"
				:to="`/dashboard/agents/${ paige.agent.id }/entities`"
			>
				<icon name="material-symbols:keyboard-backspace" />
				Back to entities
			</nuxt-link>
		</p>

		<pre>{{ paige.entity }}</pre>
	</div>
</template>

<script setup>
	const paige = usePaige();
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

</style>
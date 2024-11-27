<template>
	<section class="dashboard-home flex-grow-1 d-flex align-items-stretch">
	</section>
</template>

<script setup>
	const user = useAuthUser();
</script>

<style lang="sass" scoped>
	.agent-chat
		border-right: 1px solid var(--bs-border-color)
		width: 400px

	.agent-section
		flex-grow: 1
		padding: 2rem
</style>
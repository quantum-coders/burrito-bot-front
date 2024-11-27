<template>
	<aside class="dashboard-sidebar" :class="{ 'is-closed': dashboard.sidebarCollapsed }">
		<dashboard-sidebar-brand />
		<dashboard-sidebar-user-info />
		<dashboard-sidebar-menu />
		<dashboard-sidebar-collapse-icon />

	</aside>
	<dashboard-sidebar-user-menu />
</template>

<script setup>
	const dashboard = useDashboard();
</script>

<style lang="sass" scoped>

	.dashboard-sidebar
		flex-shrink: 0
		width: var(--dashboard-sidebar-width)
		max-height: 100dvh
		overflow-y: auto
		overflow-x: hidden
		transition: all 500ms ease-in-out
		z-index: 3

		&.is-closed
			width: calc(30px + 2rem)
</style>
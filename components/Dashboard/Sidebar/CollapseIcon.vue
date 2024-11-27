<template>
	<a class="icon-collapse" href="#" @click.prevent="collapseSidebar">
		<icon name="iconoir:sidebar-collapse" />
	</a>
</template>

<script setup>

	const collapsed = ref(false);
	const dashboard = useDashboard();

	// get from local storage
	if(localStorage.getItem('global-sidebar-collapsed') === 'true') {
		collapsed.value = true;
		dashboard.sidebarCollapsed = true;
	}

	const collapseSidebar = () => {
		collapsed.value = !collapsed.value;

		// store in local storage
		localStorage.setItem('global-sidebar-collapsed', collapsed.value ? 'true' : 'false');
		dashboard.sidebarCollapsed = collapsed.value;
	};
</script>

<style lang="sass" scoped>

	.icon-collapse
		color: white
		font-size: 1.25rem
		position: absolute
		right: 17px
		bottom: 0.5rem
		transition: all 0.5s ease-in-out
</style>
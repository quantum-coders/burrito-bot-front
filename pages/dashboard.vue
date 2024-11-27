<template>
	<nuxt-page />
</template>

<script setup>
	definePageMeta({ middleware: 'auth', layout: 'dashboard' });
	useHead({ title: 'Dashboard' });

	const user = useAuthUser();

	const dashboard = useDashboard();

	dashboard.title = 'Paige';

	dashboard.menu = [
		{
			name: 'Dashboard',
			icon: 'hugeicons:house-03',
			section: '/dashboard',
			subpages: false,
		},
		{
			name: 'Agents',
			icon: 'hugeicons:robotic',
			section: '/dashboard/agents',
		},
	];
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

</style>
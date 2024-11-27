import { defineStore } from 'pinia';
export const useDashboard = defineStore('dashboard', () => {

	const sidebarCollapsed = ref(false);
	const title = ref('');
	const menu = ref([]);

	return {
		menu,
		title,
		sidebarCollapsed,
	};
});
<template>
	<nav class="sidebar-menu">
		<ul class="list-unstyled">
			<li v-for="(item, i) in dashboard.menu">
				<nuxt-link
					:to="item.section"
					:class="{ 'parallel-page': isCurrentLink(item.section) && item.subpages !== false }"
				>
					<span
						class="icon"
						v-tippy="{ content: dashboard.sidebarCollapsed ? item.name : '', placement: 'right', arrow: false, offset: [0, 20] }"
					>
						<icon :name="item.icon" />
					</span>
					{{ item.name }}
				</nuxt-link>
			</li>
		</ul>
	</nav>
</template>

<script setup>
	const dashboard = useDashboard();

	const isCurrentLink = (link) => {
		console.log('isCurrentLink', useRoute().path);
		return useRoute().path.includes(link);
	};
</script>

<style lang="sass" scoped>

	.sidebar-menu
		width: var(--dashboard-sidebar-width)

		ul
			li
				a
					display: flex
					align-items: center
					gap: 1rem
					padding: 0.5rem 1rem
					color: white
					text-decoration: none
					transition: background 0.3s

					&.router-link-exact-active,
					&.parallel-page
						background: rgba(255, 255, 255, 0.25)

					.icon
						width: 30px
						font-size: 1.4rem
						flex-shrink: 0
						display: flex
						justify-content: center
						align-items: center

					&:hover
						background: rgba(255, 255, 255, 0.1)
</style>
<template>
	<div class="user-menu" :class="{ 'sidebar-collapsed': dashboard.sidebarCollapsed }">
		<div class="menu-info border-bottom">
			<p class="mb-0">{{ user.nicename }}</p>
			<p class="fs-7 mb-0">Administrador</p>
		</div>
		<ul class="menu-navigation list-unstyled">
			<li>
				<nuxt-link :to="`/dashboard/users/${ user.id }`">Mi Perfil</nuxt-link>
			</li>
			<li>
				<nuxt-link to="/">Sitio Web</nuxt-link>
			</li>
			<li><a href="#" @click.prevent="logout">Cerrar sesión</a></li>
		</ul>
	</div>
</template>

<script setup>
	const user = useAuthUser();
	const { logout } = useAuth({
		loginUrl: '/users/login',
		logoutUrl: '/login',
	});

	const dashboard = useDashboard();
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.dashboard:has(.dashboard-sidebar .user-info:hover), .dashboard:has(.user-menu:hover)
		.user-menu
			display: block

	.user-menu
		display: none
		background: var(--bs-body-bg)
		position: absolute
		left: var(--dashboard-sidebar-width)
		z-index: 1000
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
		top: 64px
		border-radius: 0 0.5rem 0.5rem 0
		overflow: clip

		&.sidebar-collapsed
			left: calc(30px + 2rem)

		.menu-info
			padding: 1rem

		.menu-navigation
			margin-bottom: 0

			li
				margin-bottom: 0

				a
					display: block
					padding: 0.5rem 1rem
					color: var(--bs-body-color)
					transition: background 0.3s
					text-decoration: none

					&:hover
						background: var(--bs-secondary)
						color: white
</style>
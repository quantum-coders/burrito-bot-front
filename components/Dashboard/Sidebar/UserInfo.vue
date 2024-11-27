<template>
	<div class="sidebar-user">
		<div class="user-info">
			<div class="avatar">
				<img :src="`${ useRuntimeConfig().public.apiURL }/users/${ user.id }/avatar`" alt="">
			</div>
			<p>{{ user.nicename }}</p>
		</div>
	</div>
</template>

<script setup>
	const user = useAuthUser();
</script>

<style lang="sass" scoped>
	.sidebar-user
		padding: 0.5rem 1rem
		width: 300px

		.user-info
			display: flex
			align-items: center
			gap: 1rem

			.avatar
				width: 30px
				flex-shrink: 0
				aspect-ratio: 1
				border-radius: 50%
				background: var(--bs-secondary)

				img
					width: 100%
					height: 100%
					object-fit: cover
					border-radius: 50%

			p
				margin-bottom: 0
				color: white
</style>
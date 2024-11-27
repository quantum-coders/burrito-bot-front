<template>
	<header class="site-header">
		<div class="d-flex align-items-center justify-content-between">
			<layout-logo />
			<div class="d-flex align-items-center">
				<nav class="primary-navigation">
				</nav>
				<layout-wallet />
			</div>
		</div>
	</header>
</template>

<script setup>
</script>

<style scoped lang="sass">

	.site-header
		position: fixed
		width: 100%
		top: 0
		z-index: 10000
		padding: 0.75rem 0 0.75rem 0.75rem
		transition: all 250ms ease
		background: white url("/images/background-texture.png")

		@media (min-width: $sm)
			position: sticky
			padding: 1rem 0 1rem 2rem

		&.fixed
			background: white url("/images/background-texture.png")
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

		.primary-navigation
			display: none
			justify-content: space-between
			padding: 1rem 0

			@media (min-width: $sm)
				display: flex

			ul
				margin-bottom: 0
				display: flex
				gap: 2rem
				align-items: center

				li
					display: block
					padding-right: 50px
					font-size: 0.8rem

					a
						text-transform: uppercase
						display: block
						color: black
						font-weight: bold
						text-decoration: none

						&:hover
							color: $brand1

</style>

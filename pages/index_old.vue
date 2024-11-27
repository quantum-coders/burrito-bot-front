<template>
	<section class="section-login">
		<div class="login">

			<div class="form-wrapper">
				<svgo-logo filled class="logo" />
				<h3 class="mb-0 title-font fw-normal">Welcome friend!</h3>
				<p class="text-muted">¿Ready for a great adventure?</p>

				<a
					:href="`${ useRuntimeConfig().public.apiURL }/users/google/redirect`"
					class="btn btn-google w-100 mb-4 py-2"
				>
					<svgo-g-logo filled class="me-2" />
					Login with Google
				</a>
			</div>
		</div>
		<div class="brand">
			<svgo-slogan class="slogan" />
		</div>
	</section>
</template>

<script setup>

</script>

<style scoped lang="sass">
	.section-login
		margin: 0.5rem
		flex-grow: 1
		display: flex
		gap: 0.5rem

		.btn-google
			border-color: var(--bs-border-color)

			&:hover
				border-color: var(--bs-border-color-translucent)
				background: rgba(black, 0.05)

		.login
			width: 35%
			flex-shrink: 0
			background: white
			border-radius: 0.5rem
			display: flex
			flex-direction: column
			justify-content: center
			padding: 2rem

			.form-wrapper
				max-width: 90%
				width: 500px
				margin: 0 auto

				:deep(.form-control)
					background: none

				:deep(label:after)
					background: transparent

			:deep(.logo)
				width: 90%
				max-width: 200px
				height: auto
				text-align: center
				margin: 0 auto 1rem

				path
					fill: var(--brand1) !important

		.brand
			display: flex
			flex-direction: column
			flex-grow: 1
			gap: 0.5rem
			border-radius: 2rem
			flex-shrink: 0
			box-shadow: inset 0 0 10rem rgba(black, 0.15)
			overflow: clip
			background: url("/images/ai.jpg") center center no-repeat
			background-size: cover
			align-items: center
			justify-content: flex-end

			&::before
				content: ''
				position: absolute
				left: 0
				bottom: 0
				width: 100%
				height: 70%
				background: linear-gradient(transparent, rgba(0, 0, 0, 0.75))

			.slogan
				width: 90%
				height: auto
				margin-bottom: 3rem
</style>

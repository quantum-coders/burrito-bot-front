<template>
	<section class="section-hang d-flex align-items-center justify-content-center vh-100">
		<div class="hang-wrapper">
			<img src="/images/hang.svg" alt="Hang in there baby!">
			<p>Hang in there baby!</p>
		</div>
	</section>
</template>

<script setup>
	definePageMeta({ middleware: 'guest' });

	const route = useRoute();

	// Receive code query param
	const code = route.query.code ?? false;

	const { setUser } = useAuth();

	onMounted(async () => {
		if(code) {

			// Ask for auth to google
			const { error, data } = await useBaseFetch('/users/google/authenticate', {
				method: 'POST',
				body: { code },
			});

			// If not error
			if(!error.value) {

				// Set user
				setUser(data.value.data, data.value.accessToken);

				// Redirect to dashboard
				await navigateTo('/dashboard');
			} else {
				// Redirect to log in
				await navigateTo({
					path: '/',
					query: {
						error: error.value.data.message,
					},
				});
			}
		} else {

			// Redirect to log in
			await navigateTo('/');
		}
	});

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.section-hang
		background: var(--brand1)

	.hang-wrapper
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		aspect-ratio: 1
		background: white
		width: 300px
		border-radius: 50%

		img
			width: 100px
			height: auto
			margin-bottom: 1rem

		p
			margin: 0
			color: var(--brand1)
			font-weight: 900

</style>
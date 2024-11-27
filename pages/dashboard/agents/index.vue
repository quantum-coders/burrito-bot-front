<template>
	<section class="d-flex flex-grow-1">

		<div class="agent-chat d-flex flex-column">
			<paige-chat class="flex-grow-1" />
		</div>
		<section class="agent-section p-4">
			<platform-loading :active="loading" />
			<div class="row">
				<template v-for="a in paige.agents">
					<div class="col-4">
						<router-link custom #default="props" :to="`/dashboard/agents/${a.id}`">
							<article class="agent" v-bind="props.action" @click="props.navigate">
								<h3>{{ a.name }}</h3>
								<p>{{ a.description || 'Boooh, no description.' }}</p>
							</article>
						</router-link>
					</div>
				</template>
			</div>
		</section>
	</section>
</template>

<script setup>
	const user = useAuthUser();
	const loading = ref(false);
	const paige = usePaige();

	onMounted(async () => {
		await paige.fetchAgents();
	});

</script>

<style lang="sass" scoped>

	.agent-chat
		border-right: 1px solid var(--bs-border-color)
		width: 400px

	.agent-section
		flex-grow: 1

	.agent
		padding: 1rem
		border: 1px solid var(--bs-border-color)
		border-radius: 0.5rem
		cursor: pointer

		&:hover
			background-color: var(--bs-light)

		h3
			margin: 0
			font-size: 1.2rem

</style>
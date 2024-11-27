<template>
	<div class="paige-chat" :class="{ 'is-empty': !hasAgents }">
		<platform-loading :active="loading" />

		<template v-if="!hasAgents">
			<div class="empty" v-if="!!loaded">
				<img src="/images/wait.svg" alt="">
				<h2>Hold a minute cowboy!</h2>
				<p>You don't have any agents yet. Create one first.</p>
				<p class="text-center">
					<a href="#" @click.prevent="createAgent" class="btn btn-primary">Create a new agent</a>
				</p>
			</div>
		</template>

		<template v-else>
			<div class="flex-grow-1 d-flex flex-column">
				<paige-thread class="flex-grow-1" />
				<div class="p-3">
					<paige-input class="w-100" />
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>

	const loaded = ref(false);
	const loading = ref(false);
	const paige = usePaige();
	const chat = useChat();

	const hasAgents = computed(() => paige.agents.length > 0);

	const createAgent = async () => {
		await paige.createAgent({});
		await useRouter().push(`/dashboard/agents/${paige.agent.id}`);
	};

	onMounted(async () => {

		loading.value = true;
		await paige.fetchAgents();
		await chat.initChat();

		loading.value = false;
		loaded.value = true;
	});

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.paige-chat
		display: flex
		flex-direction: column

		&.is-empty
			justify-content: center
			align-items: center

		.empty
			img
				width: 50%
				display: block
				margin: 2rem auto
</style>
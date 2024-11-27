<template>
	<section class="d-flex flex-grow-1">

		<div class="agent-chat d-flex flex-column">
			<paige-chat class="flex-grow-1" />
		</div>
		<section class="agent-section">
			<platform-loading v-if="paige.agentLoading" />

			<ul class="nav nav-pills m-3 mb-0">
				<li class="nav-item">
					<nuxt-link
						class="nav-link"
						exact-active-class="active"
						:to="`/dashboard/agents/${ useRoute().params.id }`"
					>Base Info
					</nuxt-link>
				</li>

				<li class="nav-item">
					<nuxt-link
						class="nav-link"
						exact-active-class="active"
						:to="`/dashboard/agents/${ useRoute().params.id }/objectives`"
					>Objectives
					</nuxt-link>
				</li>

				<li class="nav-item">
					<nuxt-link
						class="nav-link"
						exact-active-class="active"
						:to="`/dashboard/agents/${ useRoute().params.id }/knowledge-base`"
					>Knowledge base
					</nuxt-link>
				</li>

				<li class="nav-item">
					<nuxt-link
						class="nav-link"
						exact-active-class="active"
						:to="`/dashboard/agents/${ useRoute().params.id }/entities`"
					>Entities
					</nuxt-link>
				</li>
			</ul>

			<nuxt-page v-if="paige.agent" />
		</section>
	</section>
</template>

<script setup>
	const user = useAuthUser();
	const paige = usePaige();

	onMounted(() => {
		paige.fetchAgent(useRoute().params.id);
	});
</script>

<style lang="sass" scoped>

	.agent-chat
		border-right: 1px solid var(--bs-border-color)
		width: 400px

	.agent-section
		display: flex
		flex-direction: column
		flex-grow: 1

</style>
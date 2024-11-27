<template>
	<div class="agent-editor">
		<platform-loading :active="paige.agentLoading" />
		<template v-if="paige.agent">
			<!-- field for agent name -->
			<div class="form-group mb-3">
				<label class="form-label" for="agent-name">Agent Name</label>
				<input
					type="text"
					id="agent-name"
					class="form-control"
					v-model="$v.name.$model"
					:class="{ 'is-invalid': $v.name.$error }"
				/>
				<div class="invalid-feedback">Please add a name</div>
			</div>

			<!-- field for agent description -->
			<div class="form-group mb-3">
				<label class="form-label" for="agent-description">Agent Description</label>
				<textarea
					id="agent-description"
					class="form-control"
					v-model="$v.description.$model"
					:class="{ 'is-invalid': $v.description.$error }"
				/>
				<div class="invalid-feedback">Please add a description so we can infer the bot objectives</div>
			</div>

			<p class="text-end">
				<button class="btn btn-primary" @click="updateAgent">Update agent</button>
			</p>

		</template>
	</div>
</template>

<script setup>
	import { required } from '@vuelidate/validators';
	import { useVuelidate } from '@vuelidate/core';
	const paige = usePaige();

	const agentRules = {
		name: { required },
		description: { required },
	};

	// compute the agent info with getter and setter
	const agent = computed({
		get: () => paige.agent,
		set: (value) => paige.agent = value,
	});

	const $v = useVuelidate(agentRules, agent);

	const updateAgent = async () => {
		$v.value.$touch();
		if($v.value.$invalid) return;

		const updatedAgent = await paige.updateAgent();
	};

	onMounted(async () => {

		if(!paige.agent) {
			await paige.fetchAgent(useRoute().params.id);
		}
	});

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	textarea
		resize: none
		min-height: 200px
</style>
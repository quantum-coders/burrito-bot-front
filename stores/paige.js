import { defineStore } from 'pinia';
export const usePaige = defineStore('paige', () => {

	const agents = ref([]);
	const agent = ref(null);
	const entity = ref(null);

	const agentLoading = ref(false);
	const entityLoading = ref(false);

	//region Agent Functions -------------------------------------------------------------------------------------------

	const fetchAgents = async () => {
		const res = await useBaseFetch('/users/me/agents');

		if(res.error.value) {
			usePrettyToast().errorToast('Error fetching agents');
		}

		agents.value = res.data.value.data;
	};

	const fetchAgent = async (id = null) => {

		let idAgent;
		if(!id) idAgent = agent.value.id;
		else idAgent = id;

		agentLoading.value = true;

		const res = await useBaseFetch(`/users/me/agents/${ idAgent }`);

		if(res.error.value) {
			usePrettyToast().errorToast('Error fetching agent');
			agentLoading.value = false;
		}

		agent.value = res.data.value.data;
		agentLoading.value = false;
	};

	const createAgent = async (data) => {
		const res = await useBaseFetch('/users/me/agents', {
			method: 'POST',
			body: JSON.stringify(data),
		});

		if(res.error.value) {
			usePrettyToast().errorToast('Error creating agent');
		}

		agent.value = res.data.value.data;
	};

	const updateAgent = async (id = null) => {

		const idAgent = agent.value.id ? agent.value.id : id;

		await useRouter().push(`/dashboard/agents/${ agent.value.id }`);

		const data = {
			name: agent.value.name,
			description: agent.value.description,
		};

		agentLoading.value = true;

		const res = await useBaseFetch(`/users/me/agents/${ idAgent }`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});

		if(res.error.value) {
			usePrettyToast().errorToast('Error updating agent');
			agentLoading.value = false;
			return false;
		}

		usePrettyToast().successToast('Agent updated successfully');
		agentLoading.value = false;
	};

	const setAgentName = async (props) => {
		if(!props) return;

		await useRouter().push(`/dashboard/agents/${ agent.value.id }`);
		console.log('name', props.name);
		agent.value.name = props.name;
	};

	const setAgentDescription = async (props) => {
		if(!props) return;

		await useRouter().push(`/dashboard/agents/${ agent.value.id }`);
		console.log('description', props.description);
		agent.value.description = props.description;
	};

	//endregion --------------------------------------------------------------------------------------------------------

	//region Entities Functions ----------------------------------------------------------------------------------------
	const addEntity = async (data = {}) => {
		if(!agent.value.entities) agent.value.entities = [];

		await useRouter().push(`/dashboard/agents/${ agent.value.id }/entities`);

		entityLoading.value = true;

		const res = await useBaseFetch(`/users/me/agents/${ agent.value.id }/entities`, {
			method: 'POST',
			body: JSON.stringify({
				name: data.name || 'New Entity',
				description: data.description || 'New Entity Description',
			}),
		});

		if(res.error.value) {
			usePrettyToast().errorToast('Error creating agent');
			entityLoading.value = false;
		}

		agent.value.entities.push(res.data.value.data);
	};

	const setEntity = async (idEntity) => {
		if(!idEntity) return;

		entityLoading.value = true;

		const res = await useBaseFetch(`/users/me/agents/${ agent.value.id }/entities/${ entity.value.id }`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});

		if(res.error.value) {
			usePrettyToast().errorToast('Error updating entity');
			entityLoading.value = false;
			return false;
		}

		usePrettyToast().successToast('Entity updated successfully');
		entityLoading.value = false;
	}

	return {
		agent,
		agents,
		entity,
		agentLoading,
		entityLoading,
		fetchAgent,
		fetchAgents,
		createAgent,
		updateAgent,
		// Calling functions
		setAgentName,
		setAgentDescription,
		// Entities functions
		addEntity,
		setEntity
	};
});
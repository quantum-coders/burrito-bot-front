<template>
	<div class="input-wrapper">
		<input placeholder="Write here..." type="text" v-model="prompt" @keyup.enter="addMessage" />

		<div class="input-actions">
			<!-- change -->
			<a href="#" class="action-send" @click.prevent="addMessage">
				<icon name="material-symbols:send" />
			</a>
		</div>
	</div>
</template>

<script setup>
	const prompt = ref('');

	const chat = useChat();

	const addMessage = async () => {
		if(prompt.value) {
			chat.addMessage({
				role: 'user',
				text: prompt.value,
			});

			chat.sendMessage(prompt.value);

			prompt.value = '';

			await nextTick();
			chat.scrollToBottom();
		}
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.input-wrapper
		display: flex
		align-items: stretch
		margin: 0 auto
		border-radius: 10rem
		max-width: var(--inner-wrapper-width)
		min-height: 40px
		border: 1px solid var(--bs-border-color)

		&:has(input:focus)
			border-color: var(--bs-primary)

		input
			padding: 0 1rem
			border: 0
			background: none
			outline: 0
			flex-grow: 1

		.input-actions
			display: flex
			align-items: center
			padding-right: 1rem

			.action-send
				display: flex
				align-items: center
				justify-content: center
				font-size: 1.5rem
</style>
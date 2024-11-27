<template>
	<div class="thread-area d-flex flex-column flex-grow-1">
		<div class="scroll-wrapper pretty-scrolls" id="thread" v-if="!!chat.thread && !!chat.thread.messages.length">
			<div class="thread-wrapper d-flex flex-column">
				<template v-for="m in chat.thread.messages">
					<paige-message :message="m" />
				</template>
			</div>
		</div>
	</div>
</template>

<script setup>
	const chat = useChat();

	const addMessage = async (message) => {
		if(message) {
			chat.addMessage({
				role: 'user',
				text: message,
			});

			await chat.sendMessage(message);
			await nextTick();
			chat.scrollToBottom();
		}
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.thread-area
		flex-grow: 1

		@media (min-width: $sm)
			padding: 1rem

		.thread-wrapper
			min-height: 100px
			max-width: 1000px
			margin: 0 auto
			padding: 1rem
</style>
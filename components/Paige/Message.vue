<template>
	<div class="message-wrapper" :class="`role-${props.message.role}`">
		<article class="message">
			<icon v-if="message.loading && !props.message.text" name="line-md:loading-twotone-loop" />
			<div class="message-content" v-html="converter.makeHtml(props.message.text)" />
		</article>

		<p class="timestamp">{{ relativeTime }}</p>
	</div>
</template>

<script setup>
	import showdown from 'showdown';
	import TimeAgo from 'javascript-time-ago';
	import en from 'javascript-time-ago/locale/en';
	const converter = new showdown.Converter({
		simpleLineBreaks: true,
	});

	try {
		TimeAgo.addDefaultLocale(en);
	} catch(e) {
		console.error(e);
	}

	const timeAgo = new TimeAgo('en-US');

	const props = defineProps({
		message: {
			type: Object,
			required: true,
		},
	});

	// Reactive relative time
	const relativeTime = ref(timeAgo.format(new Date(props.message.created)));

	let intervalId;

	onMounted(() => {
		// Update the relative time every 30 seconds
		intervalId = setInterval(() => {
			relativeTime.value = timeAgo.format(new Date(props.message.created));
		}, 30000);
	});

	onUnmounted(() => {
		// Clear the interval when the component is destroyed
		clearInterval(intervalId);
	});

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.message-wrapper
		display: flex
		flex-direction: column
		max-width: 80%
		margin: 0.5rem 0

		&.role-user
			align-items: flex-end
			align-self: flex-end

		&.role-agent
			align-self: flex-start
			background: var(--bs-light-bg-subtle)
			color: var(--bs-dark)

		.message
			display: flex
			flex-direction: column
			padding: 0.5rem
			border-radius: 0.5rem
			background: var(--bs-light-bg-subtle)
			border: 1px solid var(--bs-border-color)
			margin-bottom: 0.25rem

			.message-content
				*:last-child
					margin: 0

			pre
				margin: 0
				white-space: pre-wrap
				word-wrap: break-word

		.timestamp
			margin-bottom: 0
			color: #AAA
			font-size: 0.6rem
			padding: 0 0.25rem

</style>
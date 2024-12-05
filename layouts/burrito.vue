<template>
	<layout-header :class="{ 'fixed': headerFixed }"/>
	<waypoint class="waypoint" @change="headerWaypoint"/>

	<section class="site-wrapper">
		<div v-if="isConnected">
			<nuxt-page/>
		</div>
		<connect v-else/>
	</section>
</template>

<script setup>
	import {Waypoint} from 'vue-waypoint';
	import {storeToRefs} from "pinia";
	const web3Store = useWeb3Store();
	const {connectionStatus, isConnected, initLoading} = storeToRefs(web3Store);

	// Debug log
	watchEffect(() => {
		console.log('Store State:', {
			connectionStatus: connectionStatus.value,
			isConnected: isConnected.value,
			initLoading: initLoading.value
		});
	});

	const headerFixed = ref(false);

	useHead({
		htmlAttrs: {
			lang: 'en',
		},
		titleTemplate: '%s',
		title: 'Burrito AI',
		meta: [
			{charset: 'utf-8'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{
				hid: 'description',
				name: 'description',
				content: 'democratizing AI',
			},
		],
	});

	const headerWaypoint = (waypointState) => {
		console.log(waypointState);
		headerFixed.value = waypointState.direction === 'UP';
	};
</script>

<style lang="sass">
	.waypoint
		position: absolute
		top: 80px
		width: 20px

	.site-wrapper
		flex: 1
		display: flex
		flex-direction: column
		max-width: 100vw
		overflow: clip
</style>

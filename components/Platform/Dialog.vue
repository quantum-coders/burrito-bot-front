<template>
	<div
		class="modal fade pretty-scrolls"
		tabindex="-1"
		role="dialog"
		ref="modal"
		@keydown.esc="closeDialog"
	>
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-body">
					<slot :close="closeDialog"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {Modal} from 'bootstrap';

	const modal = ref(null);
	let bootstrapModal = null;

	const openDialog = () => {
		if (bootstrapModal) bootstrapModal.show();
	};

	const closeDialog = () => {
		if (bootstrapModal) bootstrapModal.hide();
	};

	const open = () => {
		openDialog();
	};

	const close = () => {
		closeDialog();
	};

	defineExpose({openDialog, closeDialog, open, close});

	onMounted(() => {
		bootstrapModal = new Modal(modal.value, {
			backdrop: true,
			keyboard: true,
			focus: true,
		});
	});

	onBeforeUnmount(() => {
		if (bootstrapModal) {
			bootstrapModal.dispose();
			bootstrapModal = null;
		}
	});
</script>

<style lang="sass" scoped>
	:deep(.modal-backdrop)
		z-index: 1500 !important

	:deep(.modal)
		z-index: 1501 !important
		display: flex !important
		align-items: center
		justify-content: center
		padding: 1rem

	// Forzar el v-toast a estar siempre arriba
	:deep(.v-toast)
		z-index: 9999999 !important
		position: fixed !important

	.modal-dialog
		max-width: 90%
		width: auto
		position: relative
		margin: 1.75rem auto
		display: flex
		align-items: center
		min-height: calc(100% - 3.5rem)

	.modal-content
		border-radius: 0.5rem
		border: 2px solid $brand1
		outline: 0.25rem solid white
		overflow: hidden
		max-width: 1200px
		width: 100%
		margin: auto
		position: relative

	.floating-close-btn
		position: fixed
		top: 1rem
		right: 1rem
		z-index: 1502
		width: 2.5rem
		height: 2.5rem
		border-radius: 50%
		background: $brand1
		border: 2px solid white
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)
		color: white
		font-size: 1.5rem
		line-height: 1
		cursor: pointer
		display: flex
		align-items: center
		justify-content: center
		transition: all 0.2s ease
		padding: 0
		transform: translate(50%, -50%)

		&:hover
			transform: translate(50%, -50%) scale(1.1)
			background: darken($brand1, 10%)
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)

		&:focus
			outline: none
			box-shadow: 0 0 0 3px rgba($brand1, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)

		&:active
			transform: translate(50%, -50%) scale(0.95)

		span
			margin-top: -2px

	.modal-body
		max-height: 80vh
		overflow-y: auto
		padding: 1.5rem

	@keyframes show
		from
			opacity: 0
			transform: scale(0.9)
		to
			opacity: 1
			transform: scale(1)

	@keyframes hide
		from
			opacity: 1
			transform: scale(1)
		to
			opacity: 0
			transform: scale(0.9)

	.modal.fade.show
		animation: show 0.3s ease-out forwards

	.modal.fade
		animation: hide 0.25s ease-out forwards

	.modal-backdrop.show
		opacity: 0.5

	::v-deep .btn-close
		display: none !important

	@media (max-width: 768px)
		.modal-dialog
			max-width: 95%
			margin: 1rem auto

		.modal
			padding: 0.5rem
		.modal-backdrop
			z-index: 1040 !important

		.v-toast
			z-index: 10000 !important
			position: fixed !important
</style>

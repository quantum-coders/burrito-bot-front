<template>
	<div class="wallet-button" v-if="!web3Store.address">
		<a href="#" @click.prevent="walletModalRef.openDialog()">Connect Wallet</a>
		<img alt="Burrito" src="/images/burrito-photo.png"/>
	</div>

	<div class="wallet-info" v-else>
		<div class="wallet-summary d-flex align-items-stretch gap-2">
			<img class="token-icon d-none d-sm-block" src="/images/burrito-token-icon.svg" alt=""/>
			<span class="d-none d-md-flex burrito-balance">
        {{ parseFloat(web3Store.balances.burrito || 0).toFixed(4) ?? 0.0 }}
      </span>
			<span class="address ms-2 d-none d-md-flex">{{ currentAccountTrimmed }}</span>

			<!-- Wallet Menu -->
			<div class="wallet-button-container" v-click-outside="closeWalletMenu">
				<div class="wallet-button">
					<a href="#" class="wallet-button" @click.prevent="toggleWalletMenu">Wallet</a>
					<img alt="Burrito" src="/images/burrito-photo.png"/>
				</div>

				<div v-if="showWalletMenu" class="wallet-menu">
					<div class="connected-account d-flex flex-column p-2">
						<div v-if="!web3Store.isCorrectNetwork && web3Store.address"
							 class="alert alert-danger mb-2 p-1 text-center">
							<a href="#" @click.prevent="switchToAvalanche" class="alert-link">
								Wrong network honey. Switch here.
							</a>
						</div>

						<small class="label">Connected Account</small>
						<span class="text-truncate fs-5">{{ currentAccountTrimmed }}</span>
					</div>

					<div class="d-flex flex-column">
						<div class="coin d-flex align-items-center gap-2 py-1 px-2">
							<img src="/images/burrito-token-icon.svg" alt="BURRITO" class="token-icon"/>
							<div>
								<small class="label">BURRITO AI Tokens</small>
								<p class="coin-qty">
									{{ parseFloat(web3Store.balances.burrito || 0).toFixed(4) ?? 0.0 }}
								</p>
							</div>
						</div>
						<div class="coin d-flex align-items-center gap-2 py-1 px-2">
							<img src="/usdt-avax.svg" alt="USDT" class="token-icon"/>
							<div>
								<small class="label">USDT</small>
								<p class="coin-qty">{{ parseFloat(web3Store.balances.usdt || 0).toFixed(4) ?? 0.0 }}</p>
							</div>
						</div>
						<div class="coin d-flex align-items-center gap-2 py-1 px-2">
							<img src="/images/avax-logo.svg" alt="AVAX" class="token-icon"/>
							<div>
								<small class="label">AVAX</small>
								<p class="coin-qty">{{
										parseFloat(web3Store.balances.native || 0).toFixed(4) ?? 0.0
									}}</p>
							</div>
						</div>
						<!-- Account Balance in USD -->
						<div class="coin d-flex align-items-center gap-2 py-1 px-2">
							<icon name="cryptocurrency:usd" size="24"/>
							<div>
								<small class="label">Account Balance (USD)</small>
								<p class="coin-qty">
									{{ parseFloat(web3Store.balances.usd || 0).toFixed(4) ?? 0.0 }}
								</p>
							</div>
						</div>

						<div class="d-flex wallet-buttons">
							<button class="btn btn-sm flex-grow-1 d-flex align-items-center gap-2"
									@click.prevent="handleStaking">
								<icon name="ph:wallet"/>
								Staking
							</button>
							<button class="btn btn-sm flex-grow-1 d-flex align-items-center gap-2"
									@click.prevent="handleBilling">
								<icon name="ph:credit-card"/>
								Billing
							</button>
							<button class="btn btn-sm flex-grow-1 d-flex align-items-center gap-2"
									@click.prevent="handleDisconnectWallet">
								<icon name="ri:logout-circle-r-line"/>
								Disconnect
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
	<platform-dialog ref="walletModalRef">
		<template #default="{ close }">
			<web3-wallet @connect="close" :close="close"/>
		</template>
	</platform-dialog>
</template>

<script setup>

	const web3Store = useWeb3Store();
	const {switchToAvalanche, disconnect} = web3Store;
	const showWalletMenu = ref(false);

	const walletModalRef = ref(null);
	const stakingModalRef = ref(null);
	const showStakingModal = ref(false);
	const showBillingModal = ref(false);
	const billingModalRef = ref(null);

	const handleClose = (modalType, closeDialog) => {
		if (modalType === 'staking') {
			showStakingModal.value = false;
		} else if (modalType === 'billing') {
			showBillingModal.value = false;
		}
		closeDialog();
	};

	const currentAccountTrimmed = computed(() => {
		if (web3Store.address) {
			return `${web3Store.address.slice(0, 6)}...${web3Store.address.slice(-4)}`;
		}
		return '';
	});

	const toggleWalletMenu = () => {
		if (!showWalletMenu.value) {
			console.log('💰 Refreshed balances - opening wallet...');
			web3Store.refreshBalances(true);
		}
		showWalletMenu.value = !showWalletMenu.value;
	};

	const closeWalletMenu = () => {
		showWalletMenu.value = false;
	};

	const handleStaking = () => {
		stakingModalRef.value.openDialog();
		showStakingModal.value = true;
		showWalletMenu.value = false;
	};

	const handleBilling = () => {
		billingModalRef.value.openDialog();
		showBillingModal.value = true;
		showWalletMenu.value = false;
	};

	const handleDisconnectWallet = () => {
		console.log('disconnecting wallet');
		disconnect();
		console.log('wallet disconnected');
		showWalletMenu.value = false;
		console.log('wallet menu closed');
		// remove user
		localStorage.removeItem('authToken');
		console.log('authToken removed');
	};
</script>


<style lang="sass" scoped>
	.wallet-info
		padding-left: 1rem

		.wallet-button
			transition: none !important

		&:has(.wallet-menu)
			.wallet-button
				a
					background: #F2F3E6
					border-bottom: 0
					border-radius: 0.5rem 0.5rem 0 0
					box-shadow: none
					padding-bottom: 20px
					margin-bottom: -20px

					&:after
						content: ''
						position: absolute
						bottom: 0
						right: 0
						width: 80%
						height: 20px
						background: #F2F3E6
						z-index: 100

		.token-icon
			width: 24px

		.burrito-balance
			font-size: 0.8em
			font-weight: bold
			border-right: 2px solid $brand1
			align-items: center
			justify-content: center
			padding-right: 0.5rem

		.address
			font-size: 0.8em
			font-weight: bold
			align-items: center
			justify-content: center

		.wallet-menu
			position: absolute
			width: calc(100vw - 2rem)
			top: 100%
			right: 1rem
			z-index: 10
			border: 2px solid $brand1
			box-shadow: 0 0.5em 0 $brand1
			border-radius: 0.5rem 0 0.5rem 0.5rem
			background: #F7F2E9

			@media (min-width: $sm)
				width: 400px
				right: 102px

			.coin,
			.connected-account
				border-bottom: 1px solid $brand1

			.coin
				.coin-qty
					line-height: 1
					margin: 0

			.label
				color: $brand1
				line-height: 1

				font-size: 0.75rem
				font-weight: 900

			.token-icon
				width: 24px
				height: 24px
				margin-right: 0.5rem

				&.wallet-icon
					margin-right: 0

		&:before
			content: ''
			position: absolute
			top: 50%
			transform: translateY(-50%)
			left: 0
			width: 100%
			height: calc(100% + 5px)
			border-radius: 10rem 0 0 10rem
			border: 2px solid $brand1
			border-right: 0

		.wallet-button
			top: -1px

	.wallet-button
		white-space: nowrap
		overflow-x: clip
		align-items: center
		display: flex
		font-size: 0.8rem
		gap: 2rem

		a
			font-weight: 900
			text-decoration: none
			border: 2px solid $brand1
			border-radius: 0.5rem
			color: $brand1
			text-transform: uppercase
			padding: 0.25rem 1rem
			box-shadow: 0 0.5em 0 $brand1
			transition: all 150ms ease-in-out !important

			&:active
				transform: translateY(0.5em)
				box-shadow: none

		img
			z-index: 100
			right: 0
			width: 70px
			transform: scale(1.5)

	.wallet-buttons
		.btn
			border-radius: 0
			border-right: 1px solid $brand1
			justify-content: center

			&:last-child
				border-right: 0

	.alert-link
		font-size: 0.875rem
		text-decoration: none


</style>

<style lang="sass" scoped>

</style>

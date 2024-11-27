import {defineStore} from 'pinia';
import {ref, computed, markRaw} from 'vue';
import {ethers, Contract} from 'ethers';
import {useToast} from 'vue-toast-notification';
import {MetaMaskWallet, CoreWallet, RabbyWallet, TrustWallet, WalletConnect} from '@thirdweb-dev/wallets';
export const SUPPORTED_WALLETS = {
	METAMASK: 'metamask',
	TRUST: 'trust',
	CORE: 'core',
	RABBY: 'rabby',
	WALLET_CONNECT: 'walletconnect',
};

export const useWeb3Store = defineStore('web3', () => {
	const toast = useToast();
	const config = useRuntimeConfig();
	const chainId = parseInt(43114);
	const burritoTokenAddress = config.public.burritoTokenAddress;
	const usdtAddress = config.public.usdtAddress;

	// State
	const walletInstance = ref(null);
	const signer = ref(null);
	const provider = ref(null);
	const address = ref(null);
	const currentChainId = ref(null);
	const connectionStatus = ref('disconnected');
	const connectionError = ref(null);
	const initLoading = ref(false);

	// Balance tracking
	const balances = ref({
		native: '0',
		burrito: '0',
		usdt: '0',
	});

	// Computed
	const isConnected = computed(() => connectionStatus.value === 'connected');
	const isConnecting = computed(() => connectionStatus.value === 'connecting');
	const formattedAddress = computed(() => {
		if (!address.value) return '';
		return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`;
	});
	const isCorrectNetwork = computed(() => currentChainId.value === chainId);

	const resetState = () => {
		console.log('🔄 Resetting state');
		walletInstance.value = null;
		signer.value = null;
		provider.value = null;
		address.value = null;
		currentChainId.value = null;
		connectionStatus.value = 'disconnected';
		connectionError.value = null;
		balances.value = {
			native: '0',
			burrito: '0',
			usdt: '0',
			usd: '0',
		};
	};

	const getThirdWebWalletProvider = async (providerName) => {
		let wallet, dappMetadata;

		dappMetadata = {
			name: 'BurritoAI',
			url: 'https://burritoai.finance',
			description: 'Simplifying crypto AI Markets',
			logoUrl: 'https://burritoai.com/favicon.ico'
		}

		try {
			const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			);

			if (isMobileDevice) {
				wallet = new WalletConnect({
					projectId: "c5b91a04226bedba6920e0bd5fd42710",
					qrcode: true,
					qrModalOptions: {
						dappMetadata,
						themeMode: "dark"
					}
				});
				console.log('📱 Mobile device detected, defaulting to WalletConnect');
			} else {
				switch (providerName) {
					case 'metamask':
						wallet = new MetaMaskWallet({
							dappMetadata
						});
						break;
					case 'core':
						wallet = new CoreWallet({
							dappMetadata
						});
						break;
					case 'rabby':
						wallet = new RabbyWallet({
							dappMetadata
						});
						break;
					default:
						wallet = new MetaMaskWallet({
							dappMetadata
						});
				}
			}
			console.log("🔌 Wallet:", wallet);

			await wallet.connect();

			const walletSigner = await wallet.getSigner();
			return {
				wallet: markRaw(wallet),
				provider: markRaw(walletSigner.provider),
				signer: markRaw(walletSigner)
			};

		} catch (error) {
			console.error('Error en provider:', error);
			throw error;
		}
	};

	const setWalletListeners = (shouldListen) => {
		try {
			const currentProvider = provider.value;

			if (!currentProvider) {
				console.warn('No provider available for setting listeners');
				return;
			}

			// Usamos los métodos on/off directamente del provider
			if (shouldListen) {
				if (typeof currentProvider.on === 'function') {
					currentProvider.on('accountsChanged', handleAccountsChanged);
					currentProvider.on('chainChanged', handleChainChanged);
				}
			} else {
				if (typeof currentProvider.off === 'function') {
					currentProvider.off('accountsChanged', handleAccountsChanged);
					currentProvider.off('chainChanged', handleChainChanged);
				}
				localStorage.removeItem('currentAccount');
			}
		} catch (error) {
			console.warn('Error in setListeners:', error);
		}
	};

	const handleAccountsChanged = async (accounts) => {
		if (Array.isArray(accounts) && accounts.length === 0) {
			await disconnect();
			return;
		}
		address.value = accounts[0];
		await refreshBalances();
	};

	const handleChainChanged = async (newChainId) => {
		currentChainId.value = parseInt(newChainId);
		await refreshBalances();
	};

	const updateUsdBalance = (balance) => {
		balances.value.usd = balance || '0';
	};

	const isReconnection = () => {
		const savedWallet = localStorage.getItem('preferredWallet');
		const currentAccount = localStorage.getItem('currentAccount');
		return savedWallet && currentAccount;
	}
	const connectWallet = async (walletType, isMobile = false) => {
		console.log('🚀 Starting wallet connection...', walletType);

		if (connectionStatus.value === 'connecting') {
			console.log('⚠️ Connection already in progress');
			return false;
		}

		try {
			connectionStatus.value = 'connecting';
			initLoading.value = true;
			connectionError.value = null;

			if (isMobile) {
				console.log('📱 Mobile device detected, defaulting to Wallet Connect');
				walletType = 'walletconnect';
			}

			const {
				wallet,
				provider: walletProvider,
				signer: walletSigner
			} = await getThirdWebWalletProvider(walletType);

			// Validate connection
			console.log('🔍 Validating connection...');
			const connectedAddress = await walletSigner.getAddress();
			const network = await walletProvider.getNetwork();

			// Update state with raw objects
			console.log('📝 Updating wallet state...');
			walletInstance.value = wallet;
			provider.value = walletProvider;
			signer.value = walletSigner;
			address.value = connectedAddress;
			currentChainId.value = network.chainId;

			// Save connection info
			localStorage.setItem('currentAccount', connectedAddress);
			localStorage.setItem('providerName', walletType);
			localStorage.setItem('preferredWallet', walletType);

			// Setup event listeners and update status
			console.log('👂 Setting up wallet listeners...');
			setWalletListeners(true);
			connectionStatus.value = 'connected';

			// Refresh balances
			console.log('💰 Fetching initial balances...');
			await refreshBalances();

			// Handle authentication
			try {
				console.log('🔐 Checking authentication status...');
				const auth = useAuth();
				const authToken = localStorage.getItem('authToken');
				let meUser = null;
				console.log('🔑 Auth token:', authToken);
				if (!authToken) {
					await auth.login({wallet: connectedAddress});
				}
				meUser = await auth.me();
				if (meUser?.balance) {
					console.log('💰 Updating USD balance:', meUser.balance);
					updateUsdBalance(meUser.balance);
				}

			} catch (error) {
				console.error('❌ Authentication check failed:', error);
			}

			console.log('✅ Wallet connected successfully');
			if(!isReconnection()) toast.success('Wallet connected successfully');
			return true;

		} catch (error) {
			console.error('❌ Wallet connection failed:', error);
			connectionError.value = {
				message: error.message,
				timestamp: new Date().toISOString(),
			};
			resetState();
			toast.error(error.message || 'Failed to connect wallet');
			return false;
		} finally {
			initLoading.value = false;
		}
	};
	const refreshBalances = async (me = false) => {
		if (!isConnected.value || !provider.value || !signer.value) {
			console.warn('⚠️ Cannot refresh balances - wallet not properly connected');
			return;
		}

		try {
			console.log('🔄 Refreshing balances...');
			if (me) {
				const userMe = await useAuth().me();
				if (userMe?.balance) {
					console.log('💰 Updating USD balance:', userMe.balance);
					updateUsdBalance(userMe.balance);
				}
			}
			const erc20Abi = [
				'function balanceOf(address owner) view returns (uint256)',
				'function decimals() view returns (uint8)',
			];

			const burritoContract = new Contract(burritoTokenAddress, erc20Abi, signer.value);
			const usdtContract = new Contract(usdtAddress, erc20Abi, signer.value);

			const [nativeBalance, burritoBalance, usdtBalance] = await Promise.all([
				provider.value.getBalance(address.value),
				burritoContract.balanceOf(address.value),
				usdtContract.balanceOf(address.value)
			]);

			balances.value = {
				...balances.value,
				native: ethers.utils.formatEther(nativeBalance),
				burrito: ethers.utils.formatEther(burritoBalance),
				usdt: ethers.utils.formatUnits(usdtBalance, 6)
			};

			console.log('💰 Balances updated:', balances.value);
		} catch (error) {
			console.error('❌ Failed to refresh balances:', error);
			toast.error('Failed to refresh balances');
		}
	};

// En useWeb3Store
	const disconnect = async () => {
		try {
			console.log('🔌 Disconnecting wallet');
			setWalletListeners(false); // Remover listeners primero
			if (walletInstance.value?.disconnect) {
				await walletInstance.value.disconnect();
			}
			resetState();
			localStorage.removeItem('preferredWallet');
			localStorage.removeItem('currentAccount'); // Importante!
			toast.success('Wallet disconnected');
		} catch (error) {
			console.error('❌ Error disconnecting wallet:', error);
			toast.error('Failed to disconnect wallet');
			resetState();
		}
	};

	const switchToAvalanche = async () => {
		if (!walletInstance.value) {
			throw new Error('No wallet connected');
		}

		try {
			await walletInstance.value.switchChain(chainId);
			currentChainId.value = chainId;
			await refreshBalances();
			return true;
		} catch (error) {
			console.error('❌ Failed to switch network:', error);
			toast.error('Failed to switch network');
			throw error;
		}
	};

	const getAvaxPrice = async () => {
		const avaxMainnetRpc = 'https://api.avax.network/ext/bc/C/rpc';
		const provider = new ethers.providers.JsonRpcProvider(avaxMainnetRpc);
		const priceFeed = new ethers.Contract(
			'0x0A77230d17318075983913bC2145DB16C7366156',
			['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'],
			provider
		);
		const [, price] = await priceFeed.latestRoundData();
		return price / 1e8;
	};

	return {
		getAvaxPrice,
		connectionStatus,
		connectionError,
		address,
		currentChainId,
		balances,
		initLoading,
		isConnected,
		isConnecting,
		formattedAddress,
		isCorrectNetwork,
		connectWallet,
		signer,
		provider,
		disconnect: resetState,
		refreshBalances,
		SUPPORTED_WALLETS,
		switchToAvalanche,
	};
});

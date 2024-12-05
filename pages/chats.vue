<!-- pages/chats.vue -->
<template>
	<div class="chat-dashboard">
		<!-- Animated Header Section -->
		<div class="header-blur position-sticky top-0 bg-white shadow-sm z-3">
			<div class="container-fluid py-4 px-4">
				<div class="row align-items-center g-3">
					<div class="col">
						<div class="d-flex align-items-center gap-2">
							<div class="animate__animated animate__fadeIn">
								<Icon
									name="uil:comments-alt"
									class="text-primary"
									size="32"
								/>
							</div>
							<div>
								<h1 class="display-6 mb-0 fw-bold">My Chats</h1>
								<p class="text-muted mb-0 d-flex align-items-center gap-2">
									<Icon name="uil:clock" size="16"/>
									Last synced {{ lastSyncTime }}
								</p>
							</div>
						</div>
					</div>
					<div class="col-auto">
						<button
							class="btn btn-primary btn-lg d-flex align-items-center gap-2"
							:class="{ 'btn-loading': isCreating }"
							@click="createNewChat"
							:disabled="isCreating"
						>
							<Icon
								:name="isCreating ? 'uil:sync' : 'uil:plus'"
								class="spin-on-loading"
							/>
							New Chat
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="container-fluid px-4 py-4">
			<!-- Search & Filters Bar -->
			<div class="row mb-4 animate__animated animate__fadeIn">
				<div class="col-md-8 col-lg-6">
					<div class="search-wrapper position-relative">
						<Icon
							name="uil:search"
							class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
						/>
						<input
							type="search"
							class="form-control form-control-lg ps-5 pe-4"
							placeholder="Search your chats..."
							v-model="searchQuery"
						>
						<transition name="fade">
							<Icon
								v-if="searchQuery"
								name="uil:times"
								class="position-absolute top-50 end-0 translate-middle-y me-3 text-muted cursor-pointer"
								@click="searchQuery = ''"
							/>
						</transition>
					</div>
				</div>
				<div class="col-md-4 col-lg-6">
					<div class="d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
						<div class="btn-group">
							<button
								class="btn btn-outline-secondary d-flex align-items-center gap-2"
								@click="toggleView"
							>
								<Icon :name="isGridView ? 'uil:grid' : 'uil:list-ul'"/>
								{{ isGridView ? 'Grid' : 'List' }}
							</button>
							<button
								class="btn btn-outline-secondary dropdown-toggle"
								data-bs-toggle="dropdown"
							>
								<Icon name="uil:sort"/>
							</button>
							<ul class="dropdown-menu dropdown-menu-end">
								<li>
									<a
										class="dropdown-item d-flex align-items-center gap-2"
										href="#"
										@click.prevent="sortChats('newest')"
									>
										<Icon name="uil:arrow-up"/>
										Newest First
									</a>
								</li>
								<li>
									<a
										class="dropdown-item d-flex align-items-center gap-2"
										href="#"
										@click.prevent="sortChats('oldest')"
									>
										<Icon name="uil:arrow-down"/>
										Oldest First
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div
				v-if="isLoading"
				class="d-flex flex-column align-items-center justify-content-center py-5"
			>
				<div class="loading-bubble">
					<Icon
						name="uil:comment-dots"
						size="48"
						class="text-primary mb-3 loading-bounce"
					/>
				</div>
				<p class="text-muted">Loading your conversations...</p>
			</div>

			<!-- Empty State -->
			<div
				v-else-if="filteredChats.length === 0"
				class="empty-state text-center py-5 animate__animated animate__fadeIn"
			>
				<div class="empty-state-icon mb-4">
					<Icon
						name="uil:comment-add"
						size="64"
						class="text-muted"
					/>
				</div>
				<h3 class="h4 mb-3">No Chats Found</h3>
				<p class="text-muted mb-4">
					{{ searchQuery ? 'Try adjusting your search terms' : 'Start a new conversation to get going!' }}
				</p>
				<button
					v-if="!searchQuery"
					class="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
					@click="createNewChat"
				>
					<Icon name="uil:plus"/>
					Create Your First Chat
				</button>
			</div>

			<!-- Chat List -->
			<div v-else>
				<transition-group
					:name="isGridView ? 'grid' : 'list'"
					tag="div"
					:class="[
            isGridView ? 'row g-4' : 'chat-list'
          ]"
				>
					<div
						v-for="chat in filteredChats"
						:key="chat.uid"
						:class="[
              isGridView ? 'col-md-6 col-lg-4 col-xl-3' : 'mb-3'
            ]"
					>
						<div
							class="chat-card h-100"
							:class="{ 'grid-view': isGridView }"
							@click="goToChat(chat.uid)"
						>
							<div class="chat-card-content p-4">
								<div class="d-flex gap-3">
									<div class="chat-avatar">
										<div class="ratio ratio-1x1">
											<div
												class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
												<Icon
													name="uil:comments"
													size="24"
													class="text-primary"
												/>
											</div>
										</div>
									</div>
									<div class="chat-info flex-grow-1">
										<h5 class="mb-1 text-truncate">
											Chat #{{ chat.uid.substr(0, 8) }}
										</h5>
										<div class="d-flex align-items-center gap-2 text-muted small">
											<Icon name="uil:clock" size="14"/>
											{{ formatDate(chat.created) }}
										</div>
									</div>
									<div class="chat-arrow ms-2 d-flex align-items-center">
										<Icon
											name="uil:angle-right"
											size="20"
											class="text-muted"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</transition-group>

				<!-- Load More -->
				<div
					v-if="hasMoreChats"
					class="text-center mt-4 pt-2"
				>
					<button
						class="btn btn-outline-primary btn-lg d-inline-flex align-items-center gap-2"
						@click="loadMoreChats"
						:disabled="isLoadingMore"
					>
						<Icon
							:name="isLoadingMore ? 'uil:sync' : 'uil:plus'"
							:class="{ 'spin': isLoadingMore }"
						/>
						{{ isLoadingMore ? 'Loading...' : 'Load More' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

	definePageMeta({
		layout: 'burrito',
		title: 'My Chats',
		description: 'View and manage your chat conversations'
	})
	const router = useRouter()
	const chatsStore = useChats()
	const isLoading = ref(true)
	const isLoadingMore = ref(false)
	const isCreating = ref(false)
	const chats = ref([])
	const searchQuery = ref('')
	const isGridView = ref(false)
	const sortOrder = ref('newest')
	const PAGE_SIZE = 12

	const lastSyncTime = computed(() => {
		return new Date().toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit'
		})
	})

	const filteredChats = computed(() => {
		let result = [...chats.value]

		// Apply search filter
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase()
			result = result.filter(chat =>
				chat.uid.toLowerCase().includes(query) ||
				formatDate(chat.created).toLowerCase().includes(query)
			)
		}

		// Apply sorting
		result.sort((a, b) => {
			const dateA = new Date(a.created)
			const dateB = new Date(b.created)
			return sortOrder.value === 'newest'
				? dateB - dateA
				: dateA - dateB
		})

		return result
	})

	const hasMoreChats = computed(() => {
		return chats.value.length % PAGE_SIZE === 0
	})

	onMounted(async () => {
		await loadChats()
	})

	const loadChats = async () => {
		isLoading.value = true
		try {
			await chatsStore.fetchChats(PAGE_SIZE)
			chats.value = chatsStore.chats
		} catch (error) {
			showToast('Error loading chats', 'danger')
		} finally {
			isLoading.value = false
		}
	}

	const loadMoreChats = async () => {
		if (isLoadingMore.value) return
		isLoadingMore.value = true
		try {
			const offset = chats.value.length
			await chatsStore.fetchChats(PAGE_SIZE, offset)
			const newChats = chatsStore.chats.slice(offset)
			chats.value.push(...newChats)
		} catch (error) {
			showToast('Error loading more chats', 'danger')
		} finally {
			isLoadingMore.value = false
		}
	}

	const createNewChat = async () => {
		if (isCreating.value) return
		isCreating.value = true
		try {
			await chatsStore.createChat()
			const newChat = chatsStore.latestChat
			if (newChat?.uid) {
				router.push(`/chat/${newChat.uid}`)
			} else {
				throw new Error('Failed to create chat')
			}
		} catch (error) {
			showToast('Error creating new chat', 'danger')
		} finally {
			isCreating.value = false
		}
	}

	const goToChat = (chatId) => {
		router.push(`/chat/${chatId}`)
	}

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const toggleView = () => {
		isGridView.value = !isGridView.value
	}

	const sortChats = (order) => {
		sortOrder.value = order
	}

	const showToast = (message, type = 'info') => {
		// Implement your toast notification here
		console.log(`${type}: ${message}`)
	}
</script>

<style scoped>
	.chat-dashboard {
		min-height: 100vh;
		background-color: #f8f9fa;
	}

	.header-blur {
		backdrop-filter: blur(10px);
		background-color: rgba(255, 255, 255, 0.9);
	}

	.search-wrapper {
		transition: all 0.3s ease;
	}

	.search-wrapper:focus-within {
		transform: translateY(-2px);
	}

	.chat-card {
		background: white;
		border-radius: 12px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.chat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		border-color: rgba(0, 0, 0, 0.15);
	}

	.chat-card:active {
		transform: translateY(0);
	}

	.chat-avatar {
		width: 48px;
		flex-shrink: 0;
	}

	.chat-arrow {
		transition: transform 0.3s ease;
	}

	.chat-card:hover .chat-arrow {
		transform: translateX(4px);
	}

	.cursor-pointer {
		cursor: pointer;
	}

	/* Animations */
	.spin {
		animation: spin 1s linear infinite;
	}

	.btn-loading .spin-on-loading {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.loading-bounce {
		animation: bounce 1s infinite;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	/* Transitions */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	.list-enter-active,
	.list-leave-active,
	.grid-enter-active,
	.grid-leave-active {
		transition: all 0.5s ease;
	}

	.list-enter-from,
	.list-leave-to,
	.grid-enter-from,
	.grid-leave-to {
		opacity: 0;
		transform: translateY(30px);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.chat-dashboard {
			padding-bottom: 80px;
		}

		.header-blur {
			padding: 1rem;
		}
	}
</style>

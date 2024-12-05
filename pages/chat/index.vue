<!-- pages/chat/index.vue -->
<template>
  <div class="container py-4">
    <div class="text-center">
      <div v-if="isCreating" class="spinner-border" role="status">
        <span class="visually-hidden">Creando chat...</span>
      </div>
      <div v-else-if="errorMessage">
        <p class="text-danger">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>

definePageMeta({ layout: 'burrito' })

const router = useRouter()
const chatStore = useChat()
const isCreating = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    // Inicializa un nuevo chat
    await chatStore.initChat()
    if (chatStore.chat && chatStore.chat.id) {
      // Redirecciona al nuevo chat
      await router.push(`/chat/${chatStore.chat.uid}`)
    } else {
      console.error('Chat ID is undefined')
      errorMessage.value = 'Error al crear el chat. Por favor, inténtalo de nuevo.'
    }
  } catch (error) {
    console.error('Error creating chat:', error)
    errorMessage.value = 'Error al crear el chat. Por favor, inténtalo de nuevo.'
  } finally {
    isCreating.value = false
  }
})
</script>

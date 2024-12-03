<!-- pages/chat/index.vue -->
<template>
  <div class="container py-4">
    <div class="text-center">
      <div v-if="isCreating" class="spinner-border" role="status">
        <span class="visually-hidden">Creating chat...</span>
      </div>
    </div>
  </div>
</template>

<script setup>

	definePageMeta({layout: 'burrito'});

const router = useRouter()
const chatStore = useChat()
const isCreating = ref(true)

onMounted(async () => {
  try {
    // Inicializa el chat
    await chatStore.initChat()
    // Redirecciona al ID del nuevo chat
    await router.push(`/chat/${chatStore.chat.uid}`)
  } catch (error) {
    console.error('Error creating chat:', error)
  }
})
</script>

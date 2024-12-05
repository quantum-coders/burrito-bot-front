<!-- pages/chat/[id].vue -->
<template>
  <div class="container py-4 wrapper-chat">
    <div v-if="isInitializing" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>Chat ID: {{ chat?.id || 'Creating...' }}</span>
        <div v-if="isLoading" class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

 <div class="card-body body-wrapper pretty-scrolls" id="thread" ref="threadRef">
    <template v-if="thread?.messages">
      <div v-for="message in thread.messages"
           :key="message.uid"
           class="mb-3">
        <!-- Nuevo manejo para mensajes de tipo function_call -->
        <div v-if="message.role === 'function_call'">
          <FunctionCallMessage :message="message" />
        </div>
        <!-- Manejo existente para otros tipos de mensajes -->
        <div v-else :class="['d-flex', message.role === 'assistant' ? 'justify-content-start' : 'justify-content-end']">
          <div :class="['card', message.role === 'assistant' ? 'bg-light' : 'bg-primary text-white']"
               style="max-width: 75%;">
            <div class="card-body py-2">
              <div v-if="message.loading" class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status" />
                <div v-if="message.text" style="white-space: pre-wrap;">{{ message.text }}</div>
              </div>
              <div v-else style="white-space: pre-wrap;">{{ message.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
      <div class="card-footer">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model.trim="messageText"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
            :disabled="isLoading"
          >
          <button
            class="btn btn-primary"
            @click="sendMessage"
            :disabled="isLoading || !messageText.trim()"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
            <span v-else>Send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
definePageMeta({ layout: 'burrito' })

const route = useRoute()
const router = useRouter()
const chatStore = useChat()
const { chat, thread } = storeToRefs(chatStore)
const messageText = ref('')
const isLoading = ref(false)
const isInitializing = ref(true)
const threadRef = ref(null)

// Debug: Observar cambios en el chat
watch(() => chat.value, (newChat, oldChat) => {
  console.log('🔄 Chat changed:', {
    old: oldChat?.id,
    new: newChat?.id
  })
}, { deep: true })

watch(() => thread.value?.messages, async (newMessages, oldMessages) => {
  console.log('📝 Messages updated:', {
    oldCount: oldMessages?.length,
    newCount: newMessages?.length
  })
  if (!oldMessages || newMessages?.length !== oldMessages?.length ||
      (newMessages?.length && newMessages[newMessages.length - 1]?.text !== oldMessages[oldMessages.length - 1]?.text)) {
    await nextTick()
    chatStore.scrollToBottom()
  }
}, { deep: true })

const scrollToBottomWithDelay = async () => {
  await nextTick()
  setTimeout(() => {
    chatStore.scrollToBottom()
  }, 100)
}

onMounted(async () => {
  console.log('🚀 Component mounted')
  console.log('📍 Current route:', {
    fullPath: route.fullPath,
    params: route.params,
    query: route.query
  })
  await initializeChat()
  scrollToBottomWithDelay()
})

// Watch for changes in route.params.id
watch(() => route.params.id, async (newId, oldId) => {
  console.log('🔄 Route param id changed:', { oldId, newId })
  isInitializing.value = true
  await initializeChat()
  isInitializing.value = false
  scrollToBottomWithDelay()
})

const initializeChat = async () => {
  console.log('⚡ Initializing chat...')
  try {
    const chatId = route.params.id
    console.log('🔑 Chat ID from route:', chatId)
    console.log('💾 Current chat in store:', chat.value?.id)

    if (!chatId || chatId === '') {
      console.log('📝 No chat ID found, creating new chat...')
      await chatStore.initChat()
      console.log('✨ New chat created:', chat.value?.id)
      // Redirect to the new chat using the generated ID
      if (chat.value?.id) {
        console.log('🔀 Redirecting to new chat...')
        await router.replace(`/chat/${chat.value.id}`)
      }
    } else {
      console.log('🔄 Loading existing chat:', chatId)
      await chatStore.initChat(chatId)
    }
  } catch (error) {
    console.error('❌ Error initializing chat:', error)
    console.log('🔄 Attempting to create new chat after error...')
    await chatStore.initChat()
    if (chat.value?.id) {
      console.log('🔀 Redirecting to new chat after error...')
      await router.replace(`/chat/${chat.value.id}`)
    }
  } finally {
    isInitializing.value = false
    console.log('✅ Chat initialization completed')
  }
}

const sendMessage = async () => {
  if (!messageText.value.trim() || isLoading.value) return

  const currentMessage = messageText.value
  messageText.value = ''
  isLoading.value = true

  try {
    console.log('📤 Sending message...')
    await chatStore.sendMessage(currentMessage)
    console.log('📨 Message sent successfully')
  } catch (error) {
    console.error('❌ Error sending message:', error)
    messageText.value = currentMessage
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.wrapper-chat {
  max-width: 1000px;
  margin: 0 auto;
}

.body-wrapper {
  min-height: 300px;
  max-height: 900px;
  overflow-y: auto;
}
</style>

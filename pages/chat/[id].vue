<template>
    <div class="container py-4 wrapper-chat">
       <div v-if="isInitializing" class="text-center">
          <div class="spinner-border" role="status">
             <span class="visually-hidden">Loading...</span>
          </div>
       </div>

       <div v-else class="card ">
          <div class="card-header d-flex justify-content-between align-items-center">
             <span>Chat ID: {{ chat?.uid || 'Creating...' }}</span>
             <div v-if="isLoading" class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
             </div>
          </div>

          <div class="card-body body-wrapper pretty-scrolls" id="thread" ref="threadRef">
             <template v-if="thread?.messages">
                <div v-for="message in thread.messages"
                     :key="message.uid"
                     class="mb-3">
                   <div :class="['d-flex', message.role === 'assistant' ? 'justify-content-start' : 'justify-content-end']">
                      <div :class="['card', message.role === 'assistant' ? 'bg-light' : 'bg-primary text-white']"
                          style="max-width: 75%;">
                         <div class="card-body py-2">
                            <div v-if="message.loading" class="d-flex align-items-center">
                               <div class="spinner-border spinner-border-sm me-2" role="status" />
                               <!-- Mostrar el texto incluso durante la carga -->
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

const route = useRoute()
const router = useRouter()
const chatStore = useChat()
const { chat, thread } = storeToRefs(chatStore)
const messageText = ref('')
const isLoading = ref(false)
const isInitializing = ref(true)
const threadRef = ref(null)

// Mejorado el watcher para el scroll
watch(() => thread.value?.messages, async (newMessages, oldMessages) => {
    if (!oldMessages || newMessages?.length !== oldMessages?.length ||
        (newMessages?.length && newMessages[newMessages.length - 1]?.text !== oldMessages[oldMessages.length - 1]?.text)) {
        await nextTick()
        chatStore.scrollToBottom()
    }
}, { deep: true })

// Asegurarse de que el scroll funcione después de que el contenido se renderice
const scrollToBottomWithDelay = async () => {
    await nextTick()
    setTimeout(() => {
        chatStore.scrollToBottom()
    }, 100)
}

onMounted(async () => {
    await initializeChat()
    scrollToBottomWithDelay()
})

const initializeChat = async () => {
    try {
        const chatId = route.params.id

        if (chatId === 'new') {
            await chatStore.initChat()
            await router.replace(`/chat/${chat.value.uid}`)
        } else if (chatId) {
            await chatStore.initChat()
        }
    } catch (error) {
        console.error('Error initializing chat:', error)
    } finally {
        isInitializing.value = false
    }
}

const sendMessage = async () => {
    if (!messageText.value.trim() || isLoading.value) return

    const currentMessage = messageText.value
    messageText.value = ''
    isLoading.value = true

    try {
        // Ya no agregamos el mensaje aquí, lo dejamos para sendMessage
        await chatStore.sendMessage(currentMessage)
    } catch (error) {
        console.error('Error sending message:', error)
        messageText.value = currentMessage // Restaurar el mensaje en caso de error
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

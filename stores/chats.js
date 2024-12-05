// stores/chats.js

import { defineStore } from 'pinia'

export const useChats = defineStore('chats', () => {
  const chats = ref([])
  const latestChat = ref(null)

  const fetchChats = async () => {
    try {
      const { data, error } = await useBaseFetch('/users/me/chats', {
        method: 'GET',
      })

      if (error.value) {
        throw new Error(error.value.message || 'Error fetching chats')
      }

      if (!data.value || !data.value.data) {
        throw new Error('Invalid data received from API')
      }

      chats.value = data.value.data.chats || []
    } catch (error) {
      console.error('Error fetching chats:', error)
      usePrettyToast().errorToast('Error al cargar los chats')
      throw error
    }
  }

  const createChat = async () => {
    try {
      const { data, error } = await useBaseFetch('/users/me/chat', {
        method: 'POST',
      })

      if (error.value) {
        throw new Error(error.value.message || 'Error creating chat')
      }

      if (!data.value || !data.value.data) {
        throw new Error('Invalid data received from API')
      }

      const newChat = data.value.data.chat
      chats.value.unshift(newChat)
      latestChat.value = newChat
    } catch (error) {
      console.error('Error creating chat:', error)
      usePrettyToast().errorToast('Error al crear un nuevo chat')
      throw error
    }
  }

  return {
    chats,
    latestChat,
    fetchChats,
    createChat,
  }
})

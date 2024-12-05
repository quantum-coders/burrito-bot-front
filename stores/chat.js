import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';
import {usePaige} from '~/stores/paige';

export const useChat = defineStore('chat', () => {

	const wisMessage = ref(null);
	const chat = ref(null);
	const thread = ref(null);

	const initChat = async (chatId = null) => {
		try {
			let data, error;

			if (chatId) {
				// Cargar chat existente
				({data, error} = await useBaseFetch(`/users/chat/${chatId}`, {
					method: 'GET',
				}));
				console.log('API Response data (existing chat):', data.value);
			} else {
				// Crear nuevo chat
				({data, error} = await useBaseFetch('/users/me/chat', {
					method: 'POST',
				}));
				console.log('API Response data (new chat):', data.value);
			}

			if (error.value) {
				console.error('Error fetching chat:', error.value);
				usePrettyToast().errorToast('Error fetching chat');
				return;
			}

			if (!data.value) {
				console.error('No data received from API');
				usePrettyToast().errorToast('No data received from API');
				return;
			}

			// Ajustar según la estructura real de los datos
			if (data.value.data && data.value.data.chat && data.value.data.thread) {
				chat.value = data.value.data.chat;
				thread.value = data.value.data.thread;
			} else if (data.value.chat && data.value.thread) {
				chat.value = data.value.chat;
				thread.value = data.value.thread;
			} else {
				console.error('Invalid data structure received from API');
				usePrettyToast().errorToast('Invalid data structure received from API');
				return;
			}

			if (!chat.value) {
				console.error('chat.value is undefined');
				usePrettyToast().errorToast('Error fetching chat data');
				return;
			}

			if (!thread.value) {
				console.error('thread.value is undefined');
				usePrettyToast().errorToast('Error fetching thread data');
				return;
			}

			// Asegurarse de que thread.value.messages es un array
			if (!Array.isArray(thread.value.messages)) {
				thread.value.messages = [];
			}

			// Esperar un breve momento para asegurar que el contenido se haya renderizado
			await new Promise((resolve) => setTimeout(resolve, 10));
			scrollToBottom(false);
		} catch (error) {
			console.error('Error in initChat:', error);
			usePrettyToast().errorToast('Error initializing chat');
		}
	};

	const addMessage = (message) => {
		// Add a unique ID to the message
		message.uid = uuidv4();

		// Add timestamp to the message
		message.created = new Date().toISOString();
		thread.value.messages.push(message);

		return message;
	};

	const scrollToBottom = (animated = true) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const thread = document.getElementById('thread');
				if (!thread) {
					resolve();
					return;
				}

				const scrollOptions = {
					top: thread.scrollHeight,
					behavior: animated ? 'smooth' : 'auto'
				};

				thread.scrollTo(scrollOptions);
				resolve();
			}, 10); // pequeño delay para asegurar que el contenido se haya renderizado
		});
	};
	const sendMessage = async (message) => {
		let assistantMessage = null;

		try {
			if (!message || !message.trim()) return;

			// Agregar mensaje del usuario
			addMessage({
				role: 'user',
				text: message,
			});

			// Crear mensaje del asistente
			assistantMessage = addMessage({
				role: 'assistant',
				text: '',
				loading: true,
			});

			await nextTick();
			scrollToBottom();

			const url = useRouter().currentRoute.value.fullPath;
			const authToken = localStorage.getItem('authToken');

			const res = await $fetch(
				`${useRuntimeConfig().public.apiURL}/ai/message/paige`,
				{
					method: 'POST',
					body: {
						url: url,
						idChat: chat.value.id,
						idThread: thread.value.id,
						agent: usePaige().agent,
						prompt: message,
					},
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${authToken}`,
					},
					responseType: 'stream',
				}
			);

			const reader = res.pipeThrough(new TextDecoderStream()).getReader();
			let buffer = '';

			while (true) {
				const {value, done} = await reader.read();

				if (value) {
					buffer += value;
					const lines = buffer.split('\n\n');
					buffer = lines.pop() || '';

					for (const line of lines) {
						let processedLine = line.trim();
						const index = thread.value.messages.findIndex(
							(m) => m.uid === assistantMessage.uid
						);

						if (index === -1) continue;

						if (processedLine.startsWith('data: ')) {
							processedLine = processedLine.substring(6);

							if (processedLine === '[DONE]') {
								thread.value.messages[index].loading = false;
								await nextTick();
								scrollToBottom();
								continue;
							}

							thread.value.messages[index].text += processedLine;
							await nextTick();
							scrollToBottom();
						} else if (processedLine.startsWith('json: ')) {
							try {
								const json = JSON.parse(processedLine.substring(6));
								console.log('Function call received:', json);

								const functionName = json.name;
								const functionArgs =
									typeof json.arguments === 'string'
										? JSON.parse(json.arguments)
										: json.arguments;

								if (typeof usePaige()[functionName] === 'function') {
									await usePaige()[functionName](functionArgs);
									await nextTick();
									scrollToBottom();
								} else {
									// Manejo de funciones no implementadas
								}
							} catch (e) {
								console.error('Error processing JSON line:', e);
							}
						} else if (processedLine === '') {
							thread.value.messages[index].text += '\n\n';
						} else if (processedLine.startsWith('\n')) {
							thread.value.messages[index].text += '\n ';
						}
					}
				}

				if (done) {
					// Procesar cualquier dato restante en el buffer
					if (buffer) {
						const lines = [buffer];
						buffer = '';

						for (const line of lines) {
							let processedLine = line.trim();
							const index = thread.value.messages.findIndex(
								(m) => m.uid === assistantMessage.uid
							);

							if (index === -1) continue;

							if (processedLine.startsWith('data: ')) {
								processedLine = processedLine.substring(6);

								if (processedLine === '[DONE]') {
									thread.value.messages[index].loading = false;
									await nextTick();
									scrollToBottom();
									continue;
								}

								thread.value.messages[index].text += processedLine;
								await nextTick();
								scrollToBottom();
							} else if (processedLine.startsWith('json: ')) {
								try {
									const json = JSON.parse(processedLine.substring(6));
									console.log('Function call received:', json);

									const functionName = json.name;
									const functionArgs =
										typeof json.arguments === 'string'
											? JSON.parse(json.arguments)
											: json.arguments;

									if (typeof usePaige()[functionName] === 'function') {
										await usePaige()[functionName](functionArgs);
										await nextTick();
										scrollToBottom();
									} else {
										// Manejo de funciones no implementadas
									}
								} catch (e) {
									console.error('Error processing JSON line:', e);
								}
							} else if (processedLine === '') {
								thread.value.messages[index].text += '\n\n';
							} else if (processedLine.startsWith('\n')) {
								thread.value.messages[index].text += '\n ';
							}
						}
					}

					// Asegurarse de que 'loading' sea false al finalizar
					const index = thread.value.messages.findIndex(
						(m) => m.uid === assistantMessage.uid
					);
					if (index !== -1) {
						thread.value.messages[index].loading = false;
					}
					await nextTick();
					scrollToBottom();
					break;
				}
			}
		} catch (error) {
			console.error('Error in sendMessage:', error);
			usePrettyToast().errorToast('Error sending message');

			if (assistantMessage) {
				const index = thread.value.messages.findIndex(
					(m) => m.uid === assistantMessage.uid
				);
				if (index !== -1) {
					thread.value.messages[index].loading = false;
					thread.value.messages[index].error = true;
					thread.value.messages[index].text =
						'Error sending message. Please try again.';
				}
			}
		} finally {
			if (assistantMessage) {
				const index = thread.value.messages.findIndex(
					(m) => m.uid === assistantMessage.uid
				);
				if (index !== -1) {
					thread.value.messages[index].loading = false;
				}
			}
		}
	};

	const openWis = async (messageUid) => {
		wisMessage.value = thread.value.messages.find((m) => m.uid === messageUid);
	};

	const closeWis = () => {
		wisMessage.value = null;
	};

	return {
		chat,
		thread,
		wisMessage,
		initChat,
		addMessage,
		sendMessage,
		openWis,
		closeWis,
		scrollToBottom,
	};
});

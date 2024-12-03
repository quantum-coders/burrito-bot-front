import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';
import {usePaige} from '~/stores/paige';

export const useChat = defineStore('chat', () => {

	const wisMessage = ref(null);
	const chat = ref(null);
	const thread = ref(null);
	const initChat = async () => {
		const {data, error} = await useBaseFetch('/users/me/chat', {
			method: 'POST',
		});

		if (error.value) {
			usePrettyToast().errorToast('Error fetching chat');
		}

		chat.value = data.value.data.chat;
		thread.value = data.value.data.thread;

		// wait 1 second
		await new Promise((resolve) => setTimeout(resolve, 10));
		scrollToBottom(false);
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
		let assistantMessage = null;  // Declaramos aquí para que esté disponible en todo el scope

		try {
			if (!message || !message.trim()) return;

			// Agregar mensaje del usuario primero
			addMessage({
				role: 'user',
				text: message
			});

			// Crear mensaje del asistente
			assistantMessage = addMessage({
				role: 'assistant',
				text: '',
				loading: true
			});

			await nextTick();
			scrollToBottom();

			const url = useRouter().currentRoute.value.fullPath;
			const authToken = localStorage.getItem('authToken');

			const res = await $fetch(`${useRuntimeConfig().public.apiURL}/ai/message/paige`, {
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
					'Authorization': `Bearer ${authToken}`,
				},
				responseType: 'stream',
			});

			const reader = res.pipeThrough(new TextDecoderStream()).getReader();
			let buffer = '';

			while (true) {
				const {value, done} = await reader.read();

				if (done) {
					const index = thread.value.messages.findIndex(m => m.uid === assistantMessage.uid);
					if (index !== -1) {
						thread.value.messages[index].loading = false;
					}
					await nextTick();
					scrollToBottom();
					break;
				}

				buffer += value;
				const lines = buffer.split('\n\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					let processedLine = line.trim();
					const index = thread.value.messages.findIndex(m => m.uid === assistantMessage.uid);

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
							if (typeof usePaige()[json.name] === 'function') {
								await usePaige()[json.name](json.arguments);
								await nextTick();
								scrollToBottom();
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

		} catch (error) {
			console.error('Error in sendMessage:', error);
			usePrettyToast().errorToast('Error sending message');

			if (assistantMessage) {
				const index = thread.value.messages.findIndex(m => m.uid === assistantMessage.uid);
				if (index !== -1) {
					thread.value.messages[index].loading = false;
					thread.value.messages[index].error = true;
					thread.value.messages[index].text = 'Error sending message. Please try again.';
				}
			}
		} finally {
			if (assistantMessage) {
				const index = thread.value.messages.findIndex(m => m.uid === assistantMessage.uid);
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

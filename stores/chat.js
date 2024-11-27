import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { usePaige } from '~/stores/paige';

export const useChat = defineStore('chat', () => {

	const wisMessage = ref(null);
	const chat = ref(null);
	const thread = ref(null);

	const initChat = async () => {
		const { data, error } = await useBaseFetch('/users/me/chat', {
			method: 'POST',
		});

		if(error.value) {
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
		// scroll to the bottom of #thread, animated
		const thread = document.getElementById('thread');
		if(!thread) return;

		if(animated) thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' });
		else thread.scrollTo({ top: thread.scrollHeight });
	};

	const sendMessage = async (message) => {

		// Create a message for assistant
		const assistantMessage = addMessage({ role: 'assistant', text: '', loading: true });

		// get current url
		const url = useRouter().currentRoute.value.fullPath;

		// Scroll to the bottom of the thread
		scrollToBottom();

		// get authToken from localStorage
		const authToken = localStorage.getItem('authToken');

		const res = await $fetch(`${ useRuntimeConfig().public.apiURL }/ai/message/paige`, {
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
				'Authorization': `Bearer ${ authToken }`,
			},
			responseType: 'stream',
		});

		assistantMessage.loading = false;

		const reader = res.pipeThrough(new TextDecoderStream()).getReader();
		let buffer = '';

		// Read the chunk of data as we get it
		while(true) {
			const { value, done } = await reader.read();

			if(done) {
				await new Promise((resolve) => setTimeout(resolve, 100));
				scrollToBottom();
				break;
			}

			buffer += value;
			const lines = buffer.split('\n\n');
			buffer = lines.pop();

			console.log('lines:', lines);

			for(let line of lines) {
				const index = thread.value.messages.findIndex((m) => m.uid === assistantMessage.uid);
				if(line === '' && index !== -1) {
					thread.value.messages[index].text += '\n\n';
					continue;
				}

				console.log('line:', line, line.startsWith('\n'), line.startsWith('\n') && index !== -1);
				if(line.startsWith('\n') && index !== -1) thread.value.messages[index].text += '\n ';
				console.log(thread.value.messages[index].text);

				line = line.trim();

				if(line.startsWith('data: ')) {
					line = line.substring(6);

					if(line === '[DONE]') {
						assistantMessage.loading = false;
						scrollToBottom();
						break;
					}

					scrollToBottom();

					if(index !== -1) thread.value.messages[index].text += line;
				}

				if(line.startsWith('json: ')) {
					const json = JSON.parse(line.substring(6));

					console.log('json:', json);

					if(typeof usePaige()[json.name] !== 'function') {
						console.error(`Function ${ json.name } not found in usePaige`);
						break;
					}

					// call the function from usePaige
					usePaige()[json.name](json.arguments);
					scrollToBottom();
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
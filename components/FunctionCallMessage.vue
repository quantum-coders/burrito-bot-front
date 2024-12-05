<template>
	<div class="card mb-3">
		<div class="card-header">
			<strong>Acción requerida:</strong> {{ message.functionCall.name }}
		</div>
		<div class="card-body">
			<p><strong>Argumentos:</strong></p>
			<pre>{{ formattedArguments }}</pre>
			<!-- Puedes agregar más lógica según el caso de uso -->
			<button class="btn btn-primary" @click="handleFunction">Ejecutar función</button>
		</div>
	</div>
</template>

<script setup>

	defineProps({
		message: {
			type: Object,
			required: true,
		},
	});

	const formattedArguments = computed(() => {
		return JSON.stringify(message.functionCall.arguments, null, 2);
	});

	const handleFunction = () => {
		// Aquí puedes manejar la ejecución de la función
		console.log('Ejecutando función:', message.functionCall.name, 'con argumentos:', message.functionCall.arguments);
		// Por ejemplo, podrías llamar a un método en usePaige o disparar una acción
	};
</script>

<style scoped>
	/* Estilos adicionales si los necesitas */
</style>

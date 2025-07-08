const chatHistory = [
    { role: "system", content: "Eres un asistente experto en consultas financieras." }
];

// Escuchar eventos para enviar mensajes
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// Función para enviar mensajes
async function sendMessage() {
    const input = document.getElementById('message-input');
    const userMessage = input.value.trim();

    if (userMessage) {
        addMessage(userMessage, 'user'); // Muestra el mensaje en el chat
        chatHistory.push({ role: "user", content: userMessage }); // Agrega al historial
        input.value = ''; // Limpia el input

        try {
            // Envía el historial al backend
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: chatHistory })
            });

            const data = await response.json();
            addMessage(data.response, 'bot'); // Muestra la respuesta del bot en el chat
            chatHistory.push({ role: "assistant", content: data.response }); // Agrega la respuesta del bot al historial
        } catch (error) {
            console.error('Error:', error);
            addMessage('Lo sentimos, hubo un error al procesar tu mensaje.', 'bot');
        }
    }
}

// Función para agregar mensajes al chat
function addMessage(text, sender) {
    const chatBody = document.getElementById('chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;

    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // Desplaza hacia abajo
}
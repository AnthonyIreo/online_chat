const socket = new WebSocket('ws://localhost:3000');
console.log(`socket created.`);
console.log(socket);
const chatContainer = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');

socket.onmessage = (event) => {
    const messageText = event.data;
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageContainer.textContent = messageText;
    chatContainer.appendChild(messageContainer);

    // focus on new message container
    messageContainer.scrollIntoView({
        behavior: 'smooth', 
        block: 'start' 
    });
};

messageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && messageInput.value) {
        const usernamefromhiden = document.getElementById('hiden-name');
        mes = usernamefromhiden.innerHTML + ':      ' + messageInput.value;
        socket.send(mes);
        messageInput.value = '';
    }
});

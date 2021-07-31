const roomName = location.pathname.split('/').pop();
const socket = io.connect('/books', { query: `roomName=${roomName}` });

const commentsList = document.querySelector('#comments');
const inputUsername = document.querySelector('#username');
const inputText = document.querySelector('#text');
const sendCommentBtn = document.querySelector('#send-comment');

const getCommentTemplate = (msg) => {
  if (!msg) {
    return '';
  }

  return `
    <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <small>${msg.username}</small>
            <small class="text-muted">${msg.msgType}</small>
        </div>
        <p class="mb-1">${msg.text}</p>
    </div>
  `;
};

socket.on('messages-in-room', (msg) => {
  msg.messages.forEach((msg) => {
    const commentItem = getCommentTemplate(msg);
    commentsList.insertAdjacentHTML('beforeend', commentItem);
  });
});

socket.on('message-to-room', (msg) => {
  const commentItem = getCommentTemplate(msg);
  commentsList.insertAdjacentHTML('beforeend', commentItem);
});

socket.io.on('reconnect', () => {
  commentsList.innerHTML = '';
});

sendCommentBtn?.addEventListener('click', () => {
  socket.emit('message-to-room', {
    username: inputUsername.value,
    text: inputText.value,
  });
});

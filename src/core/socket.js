module.exports = (io, roomModel, nameSpace = '/') => {
  io.of(`${nameSpace}`).on('connection', async (socket) => {
    const { id } = socket;
    console.log(`Socket connected: ${id}`);

    // MESSAGE_TO_ME
    socket.on('message-to-me', (msg) => {
      msg.msgType = 'me';
      socket.emit('message-to-me', msg);
    });

    // MESSAGE_TO_ALL
    socket.on('message-to-all', (msg) => {
      msg.msgType = 'all';
      io.emit('message-to-all', msg);
    });

    // ROOMS
    const { roomName } = socket.handshake.query;
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);

    let room;
    if (roomName) {
      room = await roomModel.findOne({ roomName });
      if (!room) {
        room = new roomModel({
          roomName,
          messages: [],
        });
        await room.save();
      } else {
        setTimeout(() => {
          socket.emit('messages-in-room', { messages: room.messages });
        }, 200);
      }
    }

    // MESSAGE_TO_ROOM
    socket.on('message-to-room', async (msg) => {
      msg.msgType = `room: ${roomName}`;

      if (room) {
        room.messages.push(msg);
        await room.save();
      }

      io.of(`${nameSpace}`).to(roomName).emit('message-to-room', msg);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${id}`);
    });
  });
};

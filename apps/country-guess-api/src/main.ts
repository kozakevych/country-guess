import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const rooms: Record<string, { countries: string[], players: string[] }> = {};

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to country-guess-api!' });
});

io.on('connection', (socket) => {
  socket.on('identify', (userId: string) => {
    socket.data.userId = userId;
  });
  socket.on('joinRoom', () => {
    const room = `room1`; // For simplicity, using a single room. You can enhance this to allow multiple rooms.
    if (!rooms[room]) rooms[room] = { countries: [], players: [] };
    const playerId = socket.data.userId || socket.id;
    if (!rooms[room].players.includes(playerId)) {
      rooms[room].players.push(playerId);
    }
    socket.join(room);
    io.to(room).emit('update', rooms[room]);
  });
  socket.on('leaveRoom', () => {
    const room = 'room1';
    if (rooms[room]) {
      rooms[room].players = rooms[room].players.filter(
        (id) => id !== socket.id && id !== socket.data.userId
      );
      socket.leave(room);
      io.to(room).emit('update', rooms[room]);
    }
  });

  socket.on('guessCountry', (countries) => {
    const room = `room1`; // For simplicity, using a single room. You can enhance this to allow multiple rooms.
    if (rooms[room] && rooms[room].countries.length < countries.length) {
      rooms[room].countries = countries;
      io.to(room).emit('update', rooms[room]);
    }
  });
  socket.on('disconnect', () => {
    const room = 'room1';
    if (rooms[room]) {
      rooms[room].players = rooms[room].players.filter(
        (id) => id !== socket.id && id !== socket.data.userId
      );
      io.to(room).emit('update', rooms[room]);
    }
  });
});

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Server is running`);
});
server.on('error', console.error);

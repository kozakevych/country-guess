/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import * as path from 'path';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Or specify your frontend URL, e.g. 'http://localhost:4200'
    methods: ['GET', 'POST']
  }
});

const rooms: Record<string, { countries: string[], players: string[] }> = {};

app.use(cors()); // Enable CORS for all routes
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to country-guess-api!' });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', () => {
    const room = `room1`; // For simplicity, using a single room. You can enhance this to allow multiple rooms.
    if (!rooms[room]) rooms[room] = { countries: [], players: [] };
    rooms[room].players.push(socket.id);
    socket.join(room);
    socket.emit('update', rooms[room]);
  });

  socket.on('guessCountry', (countries) => {
    const room = `room1`; // For simplicity, using a single room. You can enhance this to allow multiple rooms.
    if (rooms[room] && rooms[room].countries.length < countries.length) {
      rooms[room].countries = countries;
      io.to(room).emit('update', rooms[room]);
    }
  });
});

io.on('disconnect', (socket) => {
  console.log('a user disconnected:', socket.id);
  for (const room in rooms) {
    rooms[room].players = rooms[room].players.filter(player => player !== socket.id);
  }
});

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

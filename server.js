import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import paths from './utils/paths.js';

dotenv.config();

const { publicDirectory } = paths;

const app = express();
app.use(cors());
app.use(express.json());

app.use(
 session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
 })
);
const server = http.createServer(app);
const io = new Server(server);
global.io = io;

app.use(express.static(publicDirectory));

import index from './routes/getWebsite.js';
import download from './routes/download.js';
import progress from './Dev/getProgress.js';

app.use('/getWebsite', index);
app.use('/download', download);
app.use('/progress', progress);

// catch 404 and forward to error handler
app.use((req, res, next) => {
 res.status(404).send({ error: 'Route not found.' });
});

// centralize error handler
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send({ error: 'An internal server error occurred.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
 console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
});

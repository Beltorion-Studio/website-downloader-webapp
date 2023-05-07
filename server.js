import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import paths from './utils/paths.js';
import logger from './utils/logger.js';
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

app.use(express.static(publicDirectory));

import index from './routes/getWebsite.js';
import download from './routes/download.js';
import deleteFolder from './Dev/deleteFolder.js';

app.use('/getWebsite', index);
app.use('/download', download);
app.use('/delete', deleteFolder);

// catch 404 and forward to error handler
app.use((req, res, next) => {
 res.status(404).send({ error: 'Route not found.' });
});

// centralize error handler
app.use((err, req, res, next) => {
 logger.error(err.stack);
 res.status(500).send({ error: 'An internal server error occurred.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 logger.info(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
});

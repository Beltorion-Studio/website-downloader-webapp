import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const development = {
 __filename,
 __dirname,
 rootPath: path.join(__dirname, '..'),
 publicDirectory: path.join(__dirname, '..', 'public'),
 logsDirectory: path.join(__dirname, '..', 'logs'),
};

const production = {
 __filename,
 __dirname,
 rootPath: path.join(__dirname, '..'),
 publicDirectory: path.join(__dirname, '..', 'public'),
 logsDirectory: 'logs_directory',
};

export default process.env.NODE_ENV === 'production' ? production : development;

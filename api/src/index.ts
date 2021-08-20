import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import https from 'https';
import http from 'https';

import {
  PORT_HTTP,
  PORT_HTTPS,
  ENV_CHECK,
  dev,
  prod,
  unitTest,
  CITest,
  SSL_KEY as key,
  SSL_CERT as cert,
  HOST,
} from './config';
import router from './routes';
const app = express();
app.set('trust-proxy', true);

app.use(cors());

// Check dotenv Loads
app.get('/dotenv-check', (req, res) => {
  res.json({ ENV_CHECK });
});

app.get('/', (req, res) => {
  res.json({ message: 'pong' });
});

// Serve API
app.use('/api', router);

// Serve App
const appPath = path.join(__dirname, '../../app/build');

if (!dev && !unitTest) app.use('/app', express.static(appPath));
``;
app.get(['/app', '/app/*'], (req, res) => {
  if (dev || unitTest) res.redirect('http://localhost:3000');
  else res.sendFile(appPath + '/index.html');
});

const httpRedirect = (server: Express) =>
  server.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect(`https://${HOST}:${PORT_HTTPS}${req.url}`);
    }
  });
const onStart = (port: number) => () =>
  console.log(
    `app listening at http${port === PORT_HTTPS ? 's' : ''}://${HOST}:${port}`
  );

const startServer = () => {
  const httpServer = express();
  let server: https.Server | http.Server;
  if (dev) {
    httpRedirect(httpServer);
    httpServer.listen(PORT_HTTP, onStart(PORT_HTTP));
    server = https.createServer({ key, cert }, app);
    server.listen(PORT_HTTPS, onStart(PORT_HTTPS));
  } else if (unitTest) {
    server = http.createServer(app).listen();
  } else if (prod || CITest) {
    app.listen(PORT_HTTP, onStart(PORT_HTTP));
  }

  return server;
};

if (!unitTest) startServer();
export { app, startServer };

/**
 * Edge Service Example for Bot Application Service
 * 
 * Roger Ngo
 * rogerngo90@gmail.com
 * 
 * http://rogerngo.com
 */

const config = require('config-node')({ env: process.env.EnvironmentName || 'development' });
const express = require('express');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const utils = require('./utils');
const app = express();
const proxy = httpProxy.createProxyServer();

// Minor performance trick... Cache the DNS information made from previous queries.
// Set the validity to 5 minutes (300s)
const dns = require('dns');
const dnscache = require('dnscache')({
    "enable": true,
    "ttl": 300,
    "cachesize": 1000
});

// In memory storage to store hashed conversation IDs
global.expBucket = [];
global.stableBucket = [];

/**
 * Configure the server.
 */
app.use(bodyParser.json());

// Simple root endpoint to check for health
app.get('/', (req, res, error) => { res.status(200).send('OK'); });

// Debug endpoint to reset the in-memory storage
app.post('/reset', (req, res, error) => {
    global.expBucket = [];
    global.stableBucket = [];
    res.status(200).send('OK');
});

app.post('/api/messages', (req, res, error) => {
    const endpoint = utils.getRoute(req.body.conversation.id);

    console.log('Routing to', endpoint);

    delete req.headers.host;
    proxy.web(req, res, {target: endpoint});
});

/**
 * Proxy Event Handling
 */

// Send back a generic error, or handle appropriately.
proxy.on('error', (e, req, res) => { res.status(500).send('A server error occurred.'); });

// Prepare payload to forward to the origin
proxy.on('proxyReq', (proxyReq, req, res, options) => {
    console.log('Proxying request.');

    const bodyData = JSON.stringify(req.body);

    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

    proxyReq.write(bodyData);
});

app.listen(config.Port, () => { console.log('Server is up and running.'); });

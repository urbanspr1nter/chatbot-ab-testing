/**
 * Bot ServiceB Example for Bot Application Service
 * 
 * Roger Ngo
 * rogerngo90@gmail.com
 * 
 * http://rogerngo.com
 */

const config = require('config-node')({ env: process.env.EnvironmentName || 'development' });
const express = require('express');
const botBuilder = require('botbuilder');
const azure = require('botbuilder-azure');

const app = express();

// Create chat connector for communicating with the Bot Framework Service
const connector = new botBuilder.ChatConnector({
    appId: config.MicrosoftAppId,
    appPassword: config.MicrosoftAppPassword
});

const storage = new botBuilder.MemoryBotStorage();
const bot = new botBuilder.UniversalBot(connector).set("storage", storage);

bot.dialog('/', (session) => {
    session.send('*~* Hello from Service B *~* o/');
});

app.get('/', (req, res, error) => { res.status(200).send('OK'); });
app.post('/api/messages', connector.listen());

app.listen(config.Port, () => { console.log('Server is up and running.'); });

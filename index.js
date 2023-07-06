const server = require('./server/remoteServerConfiguration.js');

const commandProcessing = require("./commandProcessing/main.js");
server.changeParserFunction(commandProcessing.process);

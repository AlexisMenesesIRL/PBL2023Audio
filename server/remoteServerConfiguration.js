const express = require('express');
const fs = require('fs');
const https = require('https');
const websocket = require('./websocketServerHandler.js');

const remoteClientFolder = __dirname + "./../public/";
const httpsport = 8001;
const httpport = 8000;

module.exports = (function(){
  let servers = {};
  servers.http = new express();
  servers.https = new express();
  
  servers.http.use(express.json());
  servers.http.use(express.urlencoded({ extended: true }));
  servers.http.use(express.static(remoteClientFolder));
  let passwebsocket = servers.http.listen(httpport);
  websocket.webSocketServer(passwebsocket,servers.http);
  
  
  servers.https.use(express.json());
  servers.https.use(express.urlencoded({ extended: true }));
  servers.https.use(express.static(remoteClientFolder));
  
  const httpsserver = https.createServer({
      key: fs.readFileSync(__dirname+'/certificates/pbl.key'),
      cert: fs.readFileSync(__dirname+'/certificates/pbl.pem')
    }, servers.https).listen(httpsport);
   
  websocket.webSocketServer(httpsserver,servers.https);

  servers.changeParserFunction = (newparser)=>{
    websocket.changeParserFunction(newparser)
  }

  return servers;

})();





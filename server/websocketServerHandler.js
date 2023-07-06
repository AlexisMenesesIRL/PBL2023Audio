const ws = require('ws');
module.exports = (function(){

  let websocket = {};  

  websocket.webSocketServer = function(expressServer,website){
          this.setuphttppost(website);
            const websocketServer = new ws.Server({
              noServer: true,
              path: "/command",
            });
            websocketServer.on('connection',(socket,connectionRequest)=>{
                socket.on('open',function(){
                    //console.log("openning... ");
                });       
                socket.on('message', (message)=>{this.parser(message,socket);});
                socket.on('close',function(){
                  //console.log("closing...")
                    //commandprocessor(JSON.stringify({label:"closewebrtc"}),socket);
                    //console.log("server closed ");
                });
            });
            expressServer.on("upgrade", (request, socket, head) => {
              websocketServer.handleUpgrade(request, socket, head, (websocket) => {
                websocketServer.emit("connection", websocket, request);
              });
            });

            return websocketServer;
          };


    websocket.setuphttppost = function(app){
      app.post("/post",(req,res)=>{
        this.parser(JSON.stringify(req.body),res);
      });
    }

    websocket.parser = function(data,response){
      console.log(data,response);
    }

    websocket.changeParserFunction = function(newparser){
      this.parser = newparser;
    }

    return websocket;
})();



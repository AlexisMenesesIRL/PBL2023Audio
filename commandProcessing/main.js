module.exports = (function(){
    
    let process = {};
    process.process = (data,socket)=>{
        let received_data = safelyParseJSON(data);
        if(received_data.command=="右" ||  received_data.command=="みぎ" )
			console.log("Move robot 右")
		else(received_data.command=="左" ||  received_data.command=="ひだり" )
			console.log("Move robot 左")
    }

    return process;
})();

const safelyParseJSON = (json) => {
    let parsed = "";
  
    try {
      parsed = JSON.parse(json);
    } catch (e) {
      console.trace("there is an error on JSON: " + json);
    }
  
    return parsed;
}


let Sendexternal = (data,socket) =>{
    let externalconnection = new WebSocket("ws://"+data.ip+":"+data.port)
    externalconnection.onopen = e => {
		externalconnection.send(data.data);
		externalconnection.close();
	}

	//エラーが発生した場合
	externalconnection.onerror = error => {
		console.log('error:',error);
	}

	//メッセージを受け取った場合
	externalconnection.onmessage = e => {
		//console.log('recv:',e);
		//facecontrollesws.close();
	};

	//通信が切断された場合
	externalconnection.onclose = e => {
		console.log('connection closed');
	};
    
}

const ROSLIB = require('roslib');
const ros = new ROSLIB.Ros({
    url : 'ws://10.1.1.191:9090'
});

ros.on('connection', function() {
	console.log('Connected to websocket server.');
});
	
ros.on('error', function(error) {
	console.log('Error connecting to websocket server: ', error);	
});

ros.on('close', function() {
	console.log('Connection to websocket server closed.');
});
		
		
const cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : '/turtle1/cmd_vel',
    messageType : 'geometry_msgs/Twist'
});

const twistRight = new ROSLIB.Message({
    linear : {
        x : 2.0,
        y : 0,
        z : 0
    },
    angular : {
        x : 0,
        y : 0,
        z : 0
    }
});

const twistLeft = new ROSLIB.Message({
    linear : {
        x : -2.0,
        y : 0,
        z : 0
    },
    angular : {
        x : 0,
        y : 0,
        z : 0
    }
});


const twistUp = new ROSLIB.Message({
    linear : {
        x : 0.0,
        y : 2.0,
        z : 0
    },
    angular : {
        x : 0,
        y : 0,
        z : 0
    }
});

const twistDown = new ROSLIB.Message({
    linear : {
        x : 0.0,
        y : -2.0,
        z : 0
    },
    angular : {
        x : 0,
        y : 0,
        z : 0
    }
});


const twistStop = new ROSLIB.Message({
    linear : {
        x : 0.0,
        y : 0,
        z : 0
    },
    angular : {
        x : 0,
        y : 0,
        z : 0
    }
});


module.exports = (function(){
    
    let process = {};
    process.process = (data,socket)=>{
        let received_data = safelyParseJSON(data);
		console.log(received_data)
        if(received_data.command=="右" ||  received_data.command=="みぎ" ){
			cmdVel.publish(twistRight);
			setTimeout(()=>{cmdVel.publish(twistStop);console.log("stop");},2000)
			console.log("Move robot 右")
		}
		else if(received_data.command=="左" ||  received_data.command=="ひだり" ){
			cmdVel.publish(twistLeft);
			setTimeout(()=>{cmdVel.publish(twistStop);console.log("stop");},2000)
			console.log("Move robot 左")
		}
		else if(received_data.command=="前" ||  received_data.command=="まえ" ){
			cmdVel.publish(twistUp);
			setTimeout(()=>{cmdVel.publish(twistStop);console.log("stop");},2000)
			console.log("Move robot 前")
		}	
		else if(received_data.command=="後ろ" ||  received_data.command=="うしろ" ){
			cmdVel.publish(twistDown);
			setTimeout(()=>{cmdVel.publish(twistStop);console.log("stop");},2000)
			console.log("Move robot 後ろ")
		}	

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

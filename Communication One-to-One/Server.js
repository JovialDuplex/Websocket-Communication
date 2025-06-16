const websocket = require('ws');


const wss = new websocket.Server({port: 8001});
console.log("serveur demarrer sur le port 8001 ");

const list_client = []

let i;

wss.on('connection', function connection(ws){
    console.log("client connecte au serveur websocket ");
    list_client.push(ws);
    console.log(list_client.length);

    ws.on('message', function incoming(message){
        console.log("message recu du client : ", message.toString());
        for (i=0; i<list_client.length; i++)
        {
            if(list_client[i] != ws){
                // console.log(ws.id)
                console.log("message retranscrit");
                list_client[i].send(message.toString());
            }
        } 

    });

});
function containList(list, element)
{
    let i;
    for(i=0; i<list.length; i++)
    {
        if(list[i] == element)
        {
            return true;
        }
    }

    return false;
}

const websocket = require('ws');

const wss = new websocket.Server({port: 8001});
console.log("serveur demarrer sur le port 8001 ");

const list_client = [];
const identification_client = {};
let i;

wss.on('connection', function connection(ws){
    console.log("client connecte au serveur websocket ");
    // list_client.push(ws);
    // console.log(list_client.length);

    ws.on('message', function incoming(message){
        // messagerie du serveur 
        let sms = JSON.parse(message);
        
        // -------------- Systeme d'authentification --------------
        if (sms.action == "auth")
        {
            console.log("authentification de : ", sms.id_client);
            console.log("authentification reussit ");

            identification_client[`${sms.id_client}`] = ws;
            
            // envoie de la reponse de connexion au client concerne 
            let send_data = {
                action: "auth",
                auth_response : true,
            };
            
            identification_client[`${sms.id_client}`].send(JSON.stringify(send_data));
            
            // verification si le client est deja connecte 
            if(containList(list_client, sms.id_client) == true)
            {
                console.log("client deja enregistrer ");    
            }
            else{
                list_client.push(sms.id_client);
            }

            console.log(list_client);
            
            // envoie de la liste des client authentifier a tous les utilisateurs 
            const send_list_client = {
                action: "send_list_client",
                list_client : list_client,
            };

            for(i=0; i < list_client.length; i++)
            {
                identification_client[list_client[i]].send(JSON.stringify(send_list_client));
            }
           
        }

        // Systeme d'envoie de message a un client bien connu
        if(sms.action == "send_sms")
        {
            console.log(sms.sender, " veut envoyer un message a : ", sms.dest);
            // recuperation du destinataire
            const dest = sms.dest;
            let new_send = {
                action: "receive_sms",
                message: sms.message,
                sender: sms.sender,
            };

            identification_client[`${dest}`].send(JSON.stringify(new_send))
            console.log("message retranscrit a ", sms.dest);
        }

    });

});

wss.on('close', function closeConnection(ws){
    console.log("Client ", ws, " deconnecter sur le serveur websocket");
})
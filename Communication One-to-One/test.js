const client = {};

console.log(client);

client.data = "bonjour";
client.model = "bonsoir";

console.log(client);

// delete client.data;

console.log(client);

for (element in client)
{
    console.log(element);
}
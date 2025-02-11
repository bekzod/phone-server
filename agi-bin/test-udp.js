const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 9999;
const MESSAGE = 'Hello, UDP Server!';

// Send a message to the UDP server
client.send(MESSAGE, SERVER_PORT, SERVER_HOST, (err) => {
    if (err) {
        console.error('Error sending message:', err);
        client.close();
    } else {
        console.log(`Message sent to ${SERVER_HOST}:${SERVER_PORT}`);
    }
});

// Listen for a response from the server
client.on('message', (msg, rinfo) => {
    console.log(`Received response from server: ${msg.toString()}`);
    client.close(); // Close the client after receiving response
});

// Handle errors
client.on('error', (err) => {
    console.error(`UDP Client error: ${err.message}`);
    client.close();
});

const dgram = require('dgram');
const fs = require('fs');

const PORT = 10000;
const HOST = '127.0.0.1';

// Set the duration (in milliseconds) for which to record audio (e.g., 3 minutes)
const recordingDuration = 1 * 60 * 1000;

// Create a UDP socket
const server = dgram.createSocket('udp4');

// Create a write stream to save incoming u-law packets into a file.
// The file 'audio.ulaw' will be created (or appended to if it exists).
const audioStream = fs.createWriteStream('audio.ulaw', { flags: 'a' });

// A flag to control whether recording is active.
let recordingActive = true;

// Handle incoming messages
server.on('message', (msg, rinfo) => {
  console.log(`Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);

  // Write the incoming packet only if within the recording duration
  if (recordingActive) {
    audioStream.write(msg, (err) => {
      if (err) {
        console.error('Error writing audio data to file:', err);
      }
    });
  } else {
    console.log('Recording period has ended. Packet not saved.');
  }
});

// Stop recording after the specified duration
setTimeout(() => {
  recordingActive = false;
  audioStream.end(() => {
    console.log('Recording ended. Audio file closed.');
  });
}, recordingDuration);

// Handle server errors
server.on('error', (err) => {
  console.error(`Server error:\n${err.stack}`);
  server.close();
});

// Start the server
server.bind(PORT, HOST, () => {
  console.log(`UDP server listening on ${HOST}:${PORT}`);
});

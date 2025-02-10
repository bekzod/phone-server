const fs = require('fs');

// Read from FD 3 (EAGI audio)
const audioStream = fs.createReadStream(null, { fd: 3 });

audioStream.on('data', (chunk) => {
    // Just for testing, print the length of received audio chunks
    console.error(`Received ${chunk.length} bytes of audio`);
});

audioStream.on('end', () => {
    console.error("End of audio stream");
});

const dgram = require("dgram");

// RTP Server Configuration
const RTP_PORT = "9999"; // Listening Port
const RTP_HOST = "127.0.0.1"; // Listen on all network interfaces

// Create a UDP socket
const rtpServer = dgram.createSocket("udp4");

// Handle incoming RTP packets
rtpServer.on("message", (msg, rinfo) => {
    console.log(`📡 Received RTP packet from ${rinfo.address}:${rinfo.port}`);
    
    // Extract RTP header information
    const version = (msg[0] >> 6) & 0x03;
    const payloadType = msg[1] & 0x7F;
    const sequenceNumber = (msg[2] << 8) | msg[3];
    const timestamp = (msg[4] << 24) | (msg[5] << 16) | (msg[6] << 8) | msg[7];

    console.log(`🔹 RTP Version: ${version}`);
    console.log(`🔹 Payload Type: ${payloadType}`);
    console.log(`🔹 Sequence Number: ${sequenceNumber}`);
    console.log(`🔹 Timestamp: ${timestamp}`);
    console.log("------------------------------------------------");
});

// Handle errors
rtpServer.on("error", (err) => {
    console.error(`❌ RTP Server Error: ${err.message}`);
    rtpServer.close();
});

// Start the RTP server
rtpServer.bind(RTP_PORT, RTP_HOST, () => {
    console.log(`✅ RTP Server listening on ${RTP_HOST}:${RTP_PORT}`);
});

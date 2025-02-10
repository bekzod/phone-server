#!/usr/bin/env node

const ari = require("ari-client");

// Connect to Asterisk ARI
ari.connect("http://localhost:8088")
    .then(client => {
        console.log("✅ Connected to Asterisk ARI");

        // Handle StasisStart event when a new call arrives
        client.on("StasisStart", async (event, incomingChannel) => {
            console.log(`📞 Incoming Call from ${incomingChannel.caller.number}`);

            // Create an ExternalMedia Channel
            const externalMediaChannel = await client.channels.externalMedia({
                app: "my-ari-app",
                external_host: "localhost:9000/rtp",
                format: "slin16"
            });

            // Create a bridge and add both channels
            const bridge = await client.bridges.create({ type: "mixing" });
            await bridge.addChannel({ channel: incomingChannel.id });
            await bridge.addChannel({ channel: externalMediaChannel.id });

            console.log("🔗 Bridge created: Caller and ExternalMedia are now connected");
        });

        client.start();
    })
    .catch(err => console.error("❌ ARI Connection Error:", err));

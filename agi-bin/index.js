#!/usr/bin/env node

const ari = require("ari-client");
let externalMediaChannel
ari.connect('http://127.0.0.1:8088', 'your_ari_user', 'your_ari_password')
    .then(async client => {
        console.log("✅ Connected to Asterisk ARI");

        // Create a mixing bridge
        const bridge = await client.bridges.create({ type: "mixing" });
        console.log(`✅ Bridge created with ID ${bridge.id}`);

        // Create an ExternalMedia channel
        externalMediaChannel = await client.channels.externalMedia({
            app: "index",
            external_host: "127.0.0.1:9999", // External media endpoint
            format: "ulaw",
            // encapsulation: "rtp",
            direction: "both"
            // direction: "send"
        });

        await bridge.addChannel({ channel: externalMediaChannel.id });

        // Handle StasisStart event when a new call arrives
        client.on("StasisStart", async (event, channel) => {
            try {
                // // Only process channels with caller information
                // if (!channel.caller || !channel.caller.number) {
                //     console.log("Skipping channel due to missing caller info");
                //     return;
                // }

                // console.log(`📞 Incoming Call from ${channel.caller.number}`);

                // // Answer the incoming call channel
                // console.log("✅ Call channel answered");

                // console.log(`✅ ExternalMedia channel created with ID ${externalMediaChannel.id}`);

                // // (Optional) If needed, answer the ExternalMedia channel here.
                // // For ExternalMedia channels, this step might not be required.
                // console.log("✅ ExternalMedia channel answered");
                console.log(channel.id)
                console.log(externalMediaChannel.id)
                // Add the call channel to the bridge immediately
                await bridge.addChannel({ channel: channel.id });
            } catch (err) {
                console.error("❌ ARI Operation Error:", err);
            }
        });

        // Start the ARI application with the name 'index'
        client.start('index');
    })
    .catch(err => console.error("❌ ARI Connection Error:", err));

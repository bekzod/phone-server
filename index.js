#!/usr/bin/env node

const ari = require("ari-client");

ari.connect('http://127.0.0.1:8088', 'your_ari_user', 'your_ari_password')
    .then(client => {
        console.log("✅ Connected to Asterisk ARI");

        // Handle StasisStart event when a new call arrives
        client.on("StasisStart", async (event, channel) => {
            try {
                await channel.answer();
                // Only process channels with caller information
                if (!channel.caller || !channel.caller.number) {
                    console.log("Skipping channel due to missing caller info");
                    return;
                }
                
                console.log(`📞 Incoming Call from ${channel.caller.number}`);
                
                // Answer the incoming call channel
                console.log("✅ Call channel answered");

                // Create a mixing bridge
                const bridge = await client.bridges.create({ type: "mixing" });
                console.log(`✅ Bridge created with ID ${bridge.id}`);

                // Create an ExternalMedia channel
                const externalMediaChannel = await client.channels.externalMedia({
                    app: "index",
                    external_host: "127.0.0.1:9999", // External media endpoint
                    format: "ulaw",
                    encapsulation: "rtp",
                    direction: "both"
                });
                console.log(`✅ ExternalMedia channel created with ID ${externalMediaChannel.id}`);

                // Answer the ExternalMedia channel
                await externalMediaChannel.answer();
                console.log("✅ ExternalMedia channel answered");

                // Add the call channel to the bridge immediately
                await bridge.addChannel({ channel: channel.id });
                console.log("✅ Call channel added to bridge");

                // Listen for the ExternalMedia channel to reach "Up" state before bridging it.
                externalMediaChannel.on("ChannelStateChange", async (event, chan) => {
                    if (chan.state === "Up") {
                        console.log("🔔 ExternalMedia channel is Up, adding to bridge.");
                        try {
                            await bridge.addChannel({ channel: chan.id });
                            console.log("✅ ExternalMedia channel added to bridge");
                        } catch (err) {
                            console.error("❌ Error adding ExternalMedia channel to bridge:", err);
                        }
                    }
                });
            } catch (err) {
                console.error("❌ ARI Operation Error:", err);
            }
        });

        // Start the ARI application with the name 'index'
        client.start('index');
    })
    .catch(err => console.error("❌ ARI Connection Error:", err));

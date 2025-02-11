#!/usr/bin/env node

const ari = require("ari-client");

(async function main() {
  const client = await ari.connect(
    "http://127.0.0.1:8088",
    "your_ari_user",
    "your_ari_password"
  );

  console.log("Connected to ARI successfully");

  const bridge = await client.bridges.create({ type: "mixing" });
  let externalChannel;
  // When a channel starts, answer and add it (and an external media channel) to the bridge.
  client.on("StasisStart", async (event, channel) => {
    await channel.answer();

    if (!channel.caller || !channel.caller.number) {
      console.log("Skipping channel due to missing caller info");
      return;
    }

    console.log(
      "StasisStart event received:",
      channel.id,
      channel.dialplan.app_data
    );

    externalChannel = await client.channels.externalMedia({
      app: "index", // Replace with your ARI app name
      external_host: "127.0.0.1:10000", // External media endpoint
      format: "ulaw",
      connection_type: "client", // client | server
      encapsulation: "rtp",
      transport: "udp",
      direction: "both",
    });

    await bridge.addChannel({ channel: channel.id });
    await bridge.addChannel({ channel: externalChannel.id });
  });

  // Cleanup code: when a channel disconnects (leaves the Stasis application),
  // remove it from the bridge.
  client.on("StasisEnd", async (event, channel) => {
    try {
      console.log(`StasisEnd event received for channel ${externalChannel.id}`);
      await bridge.removeChannel({ channel: externalChannel.id });
      console.log(`Channel ${externalChannel.id} detached from bridge`);
    } catch (error) {
      console.error(
        `Error detaching channel ${externalChannel.id} from bridge:`,
        error
      );
    }
  });

  client.start("index");
})();

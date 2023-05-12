/** @format */

import config from "config";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: Object.values(GatewayIntentBits),
});

client.on(Events.ClientReady, () => {
    console.log(`[READY]: ${client.user.tag} (${client.user.id})`);
});

client
    .login(config.get("token"))
    .then(() => console.log(`[LOGIN]: OK`))
    .catch(() => console.error(`[LOGIN]: ERR`));

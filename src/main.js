/** @format */

import "dotenv/config.js";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: Object.values(GatewayIntentBits),
});

client.on(Events.ClientReady, () => {
    console.log(`[READY]: ${client.user.tag} (${client.user.id})`);
});

client
    .login(process.env.TOKEN)
    .then(() => console.log(`[LOGIN]: OK`))
    .catch(() => console.error(`[LOGIN]: ERR`));

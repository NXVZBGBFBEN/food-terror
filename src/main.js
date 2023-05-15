/** @format */

import config from "config";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

import loadCommand from "./functions/load-command.js";

/* 初期化 */
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});
client.commands = new Collection();

/* スラッシュコマンド読み込み */
client.once(Events.ClientReady, async () => {
    await loadCommand()
        .then((readCommands) => {
            for (let i = 0; i < readCommands.length; i++) {
                client.commands.set(readCommands[i].data.name, readCommands[i]);
            }
            console.log(`[LOAD-COMMAND]: OK`);
        })
        .catch((e) => {
            console.error(`[LOAD-COMMAND]: ERR: ${e}`);
            client.destroy();
        });
    console.log(`[READY]: ${client.user.tag} (${client.user.id})`);
});

client
    .login(config.get("token"))
    .then(() => console.log(`[LOGIN]: OK`))
    .catch(() => console.error(`[LOGIN]: ERR`));

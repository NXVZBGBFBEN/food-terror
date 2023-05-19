/** @format */

import fs from "fs";
import path from "path";
import url from "url";

import config from "config";
import {Client, Collection, Events, GatewayIntentBits} from "discord.js";

import loadCommand from "./functions/load-command.js";


const FILE_NAME = url.fileURLToPath(import.meta.url);
const DIR_NAME = path.dirname(FILE_NAME);

/* 初期化 */
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

/* JSON読み込み */
let channelTarget = JSON.parse(fs.readFileSync(path.resolve(DIR_NAME,"channel-target.json"), "utf8"));
console.log(`load: ${JSON.stringify(channelTarget)}`);

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

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
        console.log(`[SLASH-COMMAND]: OK: \`/${command.data.name}\``);
    } catch (e) {
        await interaction.reply({content: "エラーが発生しました．管理者に連絡してください．", ephemeral: true});
        console.error(`[SLASH-COMMAND]: ERR: ${e}`);
    }
});

client.on(Events.MessageCreate, async (message) => {
    console.log(message.channel);


});

client
    .login(config.get("token"))
    .then(() => console.log(`[LOGIN]: OK`))
    .catch(() => console.error(`[LOGIN]: ERR`));
/** @format */

import fs from "fs";
import path from "path";
import url from "url";

import config from "config";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

import loadCommand from "./functions/load-command.js";

const FILE_NAME = url.fileURLToPath(import.meta.url);
const DIR_NAME = path.dirname(FILE_NAME);
const jsonPath = path.resolve(DIR_NAME, "channel-target.json");

/* 初期化 */
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

/* JSON初期化 */
fs.writeFileSync(jsonPath, '{"targetChannel":""}');

/* JSON読み込み */
let channelTarget = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
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
        await interaction.reply({ content: "エラーが発生しました．管理者に連絡してください．", ephemeral: true });
        console.error(`[SLASH-COMMAND]: ERR: ${e}`);
    }
});

const channelLog = [];
let channelCount = {};
let i = 0;

client.on(Events.MessageCreate, async (message) => {
    // 直近10投稿が最も多く投稿されたチャンネルを選出
    channelCount = {};
    channelLog[i] = message.channel.id;
    i += 1;
    if (i > 9) i = 0;

    for (let w = 0; w < channelLog.length; w++) {
        const elm = channelLog[w];
        channelCount[elm] = (channelCount[elm] || 0) + 1;
    }

    const keys = Object.keys(channelCount);
    const objs = Object.values(channelCount);

    let biggerObj = 0;

    for (let h = 0; h < objs.length; h++) {
        if (biggerObj <= objs[h] + 0) biggerObj = h;
    }

    channelTarget = {
        targetChannel: keys[biggerObj], // in the message.channel.id
    };

    // JSON書き込み
    fs.writeFileSync(jsonPath, JSON.stringify(channelTarget));
});

client
    .login(config.get("token"))
    .then(() => console.log(`[LOGIN]: OK`))
    .catch(() => console.error(`[LOGIN]: ERR`));

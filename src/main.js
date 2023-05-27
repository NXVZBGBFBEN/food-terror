/** @format */

import fs from "fs";
import path from "path";
import url from "url";

import config from "config";
import {Client, Collection, Events, GatewayIntentBits} from "discord.js";

import loadCommand from "./functions/load-command.js";

const FILE_NAME = url.fileURLToPath(import.meta.url);
const DIR_NAME = path.dirname(FILE_NAME);
const jsonPath = path.resolve(DIR_NAME, "channel-target.json");

/* 初期化 */
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

/* JSON読み込み */
const channelTarget = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
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

const idsObj = {  "guildID":[], "channelID": [], "msgLog":[], "i":[]}
let aryLog = [];

client.on(Events.MessageCreate, async (message) => {

    if(!idsObj.guildID.includes(`${message.guildId}`)){
        idsObj.guildID[idsObj.guildID.length] = message.guildId;
        idsObj.channelID[idsObj.channelID.length] = message.channel;
        idsObj.msgLog[idsObj.msgLog.length] = [];
        idsObj.i[idsObj.i.length] = 0;
    }

    const indexId = idsObj.guildID.indexOf(`${message.guildId}`);

    aryLog = idsObj.msgLog[indexId];
    aryLog[idsObj.i[indexId]] = message.channelId;

    if(idsObj.i[indexId] < 9)idsObj.i[indexId] += 1;
    else idsObj.i[indexId]  = 0;

    const counter = {};

    aryLog.forEach((i) => {
        counter[i] = (counter[i] || 0) + 1;
    });

    let biggestVal = 0;

    const key = Object.keys(counter);
    const val = Object.values(counter);

    for(let i = 0; i < val.length; i++){
        if(biggestVal <= val[i])biggestVal = i;
    }

    idsObj.channelID[indexId] = key[biggestVal];
    idsObj.msgLog[indexId] = aryLog;

    // JSON書き込み
    fs.writeFileSync(jsonPath, JSON.stringify(idsObj));

});

client
    .login(config.get("token"))
    .then(() => console.log(`[LOGIN]: OK`))
    .catch(() => console.error(`[LOGIN]: ERR`));

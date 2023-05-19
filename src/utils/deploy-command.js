/** @format */

import config from "config";
import { REST, Routes } from "discord.js";

import loadCommand from "../functions/load-command.js";

const rest = new REST({ version: "10" }).setToken(config.get("token"));

(async () => {
    const commands = [];
    await loadCommand()
        .then((readCommands) => {
            for (let i = 0; i < readCommands.length; i++) {
                commands.push(readCommands[i].data.toJSON());
            }
            console.log(`[LOAD-COMMAND]: OK`);
        })
        .catch((e) => {
            console.error(`[LOAD-COMMAND]: ERR: ${e}`);
        });
    try {
        const commandData = await rest.put(Routes.applicationGuildCommands(config.get("applicationId"), config.get("guildId")), {
            body: commands,
        });
        console.log(`[REGISTER-COMMAND/GUILD]: OK: ${commandData.length} command(s) registered`);
    } catch (e) {
        console.error(`[REGISTER-COMMAND]: ERR: ${e}`);
    }
})();

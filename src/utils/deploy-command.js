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
//    try {

        /*
        let route;
        let commandKind;
        switch (process.env.NODE_ENV) {
            case "development":
                commandKind = "guild";
                route = Routes.applicationGuildCommands(config.get("applicationId"), config.get("guildId"));
                break;
            case "production" || "staging":
                commandKind = "global";
                route = Routes.applicationCommands(config.get("applicationId"));
                break;
            default:
                break;
        }
        const commandData = await rest.put(route, { body: commands });
        console.log(`[REGISTERING-COMMAND]: OK: ${commandData.length} ${commandKind} command(s) registered`);
/*    } catch (e) {
        console.error(`[REGISTERING-COMMAND]: ERR: ${e}`);
    } */
})();

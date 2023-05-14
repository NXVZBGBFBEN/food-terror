/**
 * @format
 * @typedef {import("@discordjs/builders").SlashCommandBuilder} SlashCommandBuilder
 */

import fs from "fs";
import path from "path";
import url from "url";

const FILE_NAME = url.fileURLToPath(import.meta.url);
const DIR_NAME = path.dirname(FILE_NAME);

/**
 * コマンドを格納してあるディレクトリからコマンドを取り出して配列に格納する
 * @return {Promise<{data: SlashCommandBuilder, execute: function}[]>}
 */
async function loadCommand() {
    /* ディレクトリを参照してファイルを得る */
    const directoryPath = path.resolve(DIR_NAME, "../commands/");
    const commandFiles = ((dirPath) => {
        const readFiles = fs.readdirSync(dirPath).filter((fileName) => fileName.endsWith(".js"));
        if (readFiles.length === 0) {
            throw new Error(`command not found in ${dirPath}`);
        } else {
            return readFiles;
        }
    })(directoryPath);
    /* ファイルからコマンドを取り出して配列に格納する
     * (呼び出されるタイミングが分かっている為，for-ofおよびループ内でのawaitを許可) */
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    const commands = [];
    for (const fileName of commandFiles) {
        const commandPath = `file://${path.join(directoryPath, fileName)}`;
        await import(commandPath).then((readCommand) => {
            const defaults = readCommand.default;
            for (const command of defaults) {
                commands.push(command);
            }
        });
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
    // debug: console.log(`X: ${JSON.stringify(commands)}`);
    return commands;
}

/* debug:
async function run() {
    try {
        await load();
        console.log("end");
    } catch (e) {
        console.log(e);
    }
}

run().then(() => {});
*/

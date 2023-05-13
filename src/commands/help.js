/** @format */

import { SlashCommandBuilder } from "discord.js";

const help = {
    data: new SlashCommandBuilder().setName("help").setDescription("このbotの情報を表示します"),
    async execute(interaction) {
        await interaction.reply("food-terror");
    },
};

export default help;

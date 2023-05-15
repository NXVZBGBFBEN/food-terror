/** @format */

import { SlashCommandBuilder } from "discord.js";

export default [
    {
        data: new SlashCommandBuilder().setName("help").setDescription("このbotの情報を表示します"),
        async execute(interaction) {
            await interaction.reply("food-terror");
        },
    },
];

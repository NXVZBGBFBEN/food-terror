/** @format */

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import client from "../main.js";

export default [
    {
        data: new SlashCommandBuilder().setName("help").setDescription("このbotのヘルプを表示します"),
        async execute(interaction) {
            const help = new EmbedBuilder()
                .setColor(0x33aaee)
                .setAuthor({
                    name: "food-terror",
                    url: "https://github.com/NXVZBGBFBEN/food-terror",
                })
                .setTitle("ヘルプ")
                .setDescription("コマンド一覧")
                .addFields(client.commands.map((e) => ({ name: `/${e.data.name}`, value: e.data.description })));
            interaction.reply({ embeds: [help] });
        },
    },
];

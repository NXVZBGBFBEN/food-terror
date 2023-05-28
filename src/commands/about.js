/** @format */

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default [
    {
        data: new SlashCommandBuilder().setName("about").setDescription("このbotの情報を表示します。"),
        async execute(interaction) {
            const about = new EmbedBuilder()
                .setColor(0xbbdd22)
                .setAuthor({
                    name: "food-terror",
                    url: "https://github.com/NXVZBGBFBEN/food-terror",
                })
                .setTitle("food-terror情報")
                .addFields([
                    {
                        name: "バージョン",
                        value: "v1.0.0-beta.1",
                    },
                    {
                        name: "開発者",
                        value: "([NXVZBGBFBEN](https://github.com/NXVZBGBFBEN),[tokotoko](https://github.com/tokotoko9981),[doit^6p](https://github.com/c-6p))",
                    },
                    {
                        name: "リポジトリ",
                        value: "[[food-terror]](https://github.com/NXVZBGBFBEN/food-terror)",
                    },
                ]);
            interaction.reply({ embeds: [about] });
        },
    },
];

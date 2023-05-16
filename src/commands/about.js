/** @format */

import {EmbedBuilder, SlashCommandBuilder} from "discord.js";



export default [
    {
        data: new SlashCommandBuilder().setName("about").setDescription("このbotの情報を表示します"),
        async execute(interaction) {
            const about = new EmbedBuilder()
                .setTitle('food-terror')
                .setColor(0xBBDD22)
            message.channel.send({ embeds: [about] })
        },
    },
];

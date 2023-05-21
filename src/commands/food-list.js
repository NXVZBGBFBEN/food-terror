/** @format */

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import schedule from "node-schedule";

export default [
    {
        data: new SlashCommandBuilder().setName("food_list").setDescription("[管理者専用] 登録済みの飯テロ一覧を表示します"),
        async execute(interaction) {
            if (!interaction.memberPermissions.has("Administrator")) {
                interaction.reply({ content: "管理者しか使えねえっつってんだろ！！", ephemeral: true });
                return;
            }
            console.log(schedule.scheduledJobs.job);
            const foodList = new EmbedBuilder()
                .setColor(0xf74c00)
                .setAuthor({
                    name: "food-terror",
                    url: "https://github.com/NXVZBGBFBEN/food-terror",
                })
                .setTitle("登録済みの飯テロ");
            interaction.reply({ embeds: [foodList] });
        },
    },
];

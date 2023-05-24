/** @format */

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { scheduledJobs } from "./food-add.js";

export default [
    {
        data: new SlashCommandBuilder().setName("food_list").setDescription("[管理者専用] 登録済みの飯テロ一覧を表示します"),
        async execute(interaction) {
            if (!interaction.memberPermissions.has("Administrator")) {
                interaction.reply({ content: "管理者しか使えねえっつってんだろ！！", ephemeral: true });
                return;
            }
            const guildJobs = scheduledJobs.filter((job) => job.targetGuild === interaction.guildId);
            const foodList = guildJobs.map((job) => {
                /** @type {any} */
                const fieldData = [
                    { name: "日時", value: `<t:${job.executionDate.getTime().toString().slice(0, -3)}:f>`, inline: true },
                    { name: "チャンネル", value: `<#${job.targetChannel}>`, inline: true },
                    { name: "投稿者", value: `${job.author.displayName} (<@${job.author.id}>)` },
                    { name: `料理名: ${job.dish.name}`, value: `${job.dish.description}` },
                ];
                return new EmbedBuilder()
                    .setColor(0xf74c00)
                    .setAuthor({
                        name: "food-terror",
                        url: "https://github.com/NXVZBGBFBEN/food-terror",
                    })
                    .setTitle("登録済みの飯テロ")
                    .setFields(fieldData)
                    .setImage(job.image)
                    .setTimestamp(job.date)
                    .setFooter({ text: `Guerrilla-Mode: ${job.guerrillaSwitch.toString()}` });
            });
            console.log("OK");
            await interaction.reply({ embeds: [foodList[0]] });
        },
    },
];

/** @format */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { scheduledJobs } from "./food-add.js";

export default [
    {
        data: new SlashCommandBuilder().setName("food_list").setDescription("[管理者専用] 登録済みの飯テロ一覧を表示します"),
        async execute(interaction) {
            /* 権限不足時の処理 */
            if (!interaction.memberPermissions.has("Administrator")) {
                interaction.reply({ content: "管理者しか使えねえっつってんだろ！！", ephemeral: true });
                return;
            }

            /* job読み込み・Embed作成 */
            const guildJobs = scheduledJobs.filter((job) => job.targetGuild === interaction.guildId);
            if (guildJobs.length === 0) {
                interaction.reply({ content: "現在飯テロは登録されていません", ephemeral: true });
                return;
            }
            const foodList = guildJobs.map((job, jobIndex) => {
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
                    .setTitle(`登録済みの飯テロ(${jobIndex + 1}/${guildJobs.length})`)
                    .setFields(fieldData)
                    .setImage(job.image)
                    .setTimestamp(job.date)
                    .setFooter({ text: `Guerrilla-Mode: ${job.guerrillaSwitch.toString()}` });
            });

            console.log("OK");

            /* Button作成 */
            const backButton = new ButtonBuilder().setCustomId("backward").setLabel("◀️ Back").setStyle(ButtonStyle.Secondary);
            const forwardButton = new ButtonBuilder().setCustomId("forward").setLabel("Forward ▶️").setStyle(ButtonStyle.Secondary);
            const buttons = new ActionRowBuilder().addComponents(/** @type {any} */ backButton, /** @type {any} */ forwardButton);

            /* 初回送信 */
            let foodIndex = 0;
            const firstResponse = await interaction.reply({
                embeds: [foodList[foodIndex]],
                components: [buttons],
                ephemeral: true,
            });

            /* Buttonのレスポンスをlisten */
            const collector = firstResponse.createMessageComponentCollector({ componentType: ComponentType.Button });
            collector.on("collect", (buttonInteraction) => {
                switch (buttonInteraction.customId) {
                    case "backward":
                        foodIndex = foodList[foodIndex - 1] ? foodIndex - 1 : guildJobs.length - 1;
                        break;
                    case "forward":
                        foodIndex = foodList[foodIndex + 1] ? foodIndex + 1 : 0;
                        break;
                    default:
                        break;
                }
                buttonInteraction.update({
                    embeds: [foodList[foodIndex]],
                    components: [buttons],
                    ephemeral: true,
                });
            });
        },
    },
];

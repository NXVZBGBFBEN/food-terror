/**
 * @format
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import url from "url";

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import schedule from "node-schedule";

export const scheduledJobs = [];
export default [
    {
        data: new SlashCommandBuilder()
            .setName("food_add")
            .setDescription("画像を登録し、指定した時間に投稿します")
            .addStringOption((option) =>
                option.setName("日時").setDescription("送信する時間をMM-dd-hh-mmの形式で指定できます").setRequired(false)
            )
            .addStringOption((option) => option.setName("説明").setDescription("画像についての説明を書けます").setRequired(false))
            .addStringOption((option) => option.setName("投稿者").setDescription("投稿者の名前を入力できます").setRequired(false))
            .addStringOption((option) => option.setName("料理名").setDescription("料理名を入力できます").setRequired(false))
            .addAttachmentOption((option) => option.setName("画像").setDescription("ファイルを添付できます").setRequired(false))
            .addStringOption((option) =>
                option
                    .setName("ゲリラモード")
                    .setDescription("onと入力した場合、直近で最もメッセージが送信されたチャンネルに投稿します")
                    .setRequired(false)
            ),

        async execute(interaction) {
            // 入力されたoptionの代入
            const receivedTime = interaction.options.getString("日時");
            const receivedStringName = interaction.options.getString("投稿者") ?? "匿名";
            const receivedStringDish = interaction.options.getString("料理名") ?? "料理名不明";
            const receivedStringExplanation = interaction.options.getString("説明") ?? "説明無し";
            const receivedAttachment = interaction.options.getAttachment("画像");
            const guerrillaSwitch = interaction.options.getString("ゲリラモード") === "on";

            const FILE_NAME = url.fileURLToPath(import.meta.url);
            const DIR_NAME = path.dirname(path.dirname(FILE_NAME));
            const jsonPath = path.resolve(DIR_NAME, "channel-target.json");
            const jsonTarget = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
            const indexJson = jsonTarget.guildID.indexOf(interaction.guildId);

            // ゲリラモード用
            const targetChannel =
                guerrillaSwitch && jsonTarget.channelID[indexJson] != null ? jsonTarget.channelID[indexJson] : interaction.channelId;
            const targetGuild = interaction.guildId;

            // prettier-ignore
            /** @type {import(discord.js).TextChannel} */
            const currentChannel = await interaction.client
                .guilds.cache.get(targetGuild)
                .channels.cache.get(targetChannel);

            // 例外処理
            if (receivedAttachment == null) {
                await interaction.reply({ content: "画像が無かったら飯テロはできないよ！", ephemeral: true });
                return;
            }

            /** @type {any} */
            const dishDescription = [
                {
                    name: receivedStringDish,
                    value: receivedStringExplanation,
                },
            ];

            // embedのセット
            const embedFood = new EmbedBuilder()
                .setTitle("飯テロです")
                .setAuthor({
                    name: "food_terror",
                })
                .setDescription(`投稿者:${receivedStringName}`)
                .setFields(dishDescription)
                .setImage(receivedAttachment.url);

            // 即時実行
            if (receivedTime == null) {
                // 受付確認
                await interaction.reply({ content: "飯テロを受付けました", ephemeral: true });
                const sentTerror = await currentChannel.send({ embeds: [embedFood] });
                if (guerrillaSwitch) {
                    await setTimeout(() => {
                        sentTerror.delete();
                    }, 60000);
                }
                return;
            }

            const arrayTime = receivedTime.split("-");
            const date = new Date();
            const executionDate = new Date(
                date.getFullYear(),
                parseInt(arrayTime[0], 10) - 1,
                parseInt(arrayTime[1], 10),
                parseInt(arrayTime[2], 10),
                parseInt(arrayTime[3], 10)
            );

            const jobId = crypto.randomUUID();

            scheduledJobs.push({
                jobId,
                executionDate,
                targetGuild,
                targetChannel,
                author: {
                    displayName: receivedStringName,
                    id: interaction.member.id,
                },
                dish: {
                    name: receivedStringDish,
                    description: receivedStringExplanation,
                },
                image: receivedAttachment.url,
                date,
                guerrillaSwitch,
            });

            // 受付確認
            await interaction.reply({ content: "飯テロを受付けました", ephemeral: true });
            // 実行(時間指定)
            await schedule.scheduleJob(executionDate, async () => {
                const sentTerror = await currentChannel.send({ embeds: [embedFood] });
                if (guerrillaSwitch) {
                    await setTimeout(() => {
                        sentTerror.delete();
                    }, 60000);
                }
                const jobIndex = scheduledJobs.findIndex((job) => job.jobId === jobId);
                scheduledJobs.splice(jobIndex, 1);
            });
        },
    },
];

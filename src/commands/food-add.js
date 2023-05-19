/** @format */

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import cron from "node-cron";

export default [
    {
        data: new SlashCommandBuilder()
            .setName("food_add")
            .setDescription("画像を登録し、指定した時間に投稿します。")
            .addStringOption((option) =>
                option.setName("日時").setDescription("送信する時間をMM-dd-hh-mmの形式で指定できます").setRequired(false)
            )
            .addStringOption((option) => option.setName("説明").setDescription("画像についての説明を書けます").setRequired(false))
            .addStringOption((option) => option.setName("投稿者").setDescription("投稿者の名前を入力できます").setRequired(false))
            .addStringOption((option) => option.setName("料理名").setDescription("料理名を入力できます").setRequired(false))
            .addAttachmentOption((option) => option.setName("画像").setDescription("ファイルを添付できます").setRequired(false))
            .addStringOption((option) => option.setName("ゲリラモード").setDescription("onと入力した場合、直近で最もメッセージが送信されたチャンネルに投稿します。").setRequired(false)),

        async execute(interaction) {
            const receivedTime = interaction.options.getString("日時");
            const receivedStringName = interaction.options.getString("投稿者");
            const receivedStringDish = interaction.options.getString("料理名");
            const receivedStringExplanation = interaction.options.getString("説明");
            const receivedAttachment = interaction.options.getAttachment("画像");
            // const guerrillaSwitch = (interaction.options.getString("ゲリラモード") === "on");

            let sendStringName = receivedStringName;
            let sendStringDish = receivedStringDish;
            let sendStringExplanation = receivedStringExplanation;

            // 例外処理
            if (sendStringName == null) {
                sendStringName = "匿名";
            }
            if (sendStringDish == null) {
                sendStringDish = "料理名不明";
            }
            if (sendStringExplanation == null) {
                sendStringExplanation = "説明無し";
            }
            if (receivedAttachment == null) {
                await interaction.reply({ content: "画像が無かったら飯テロはできないよ！", ephemeral: true });
                return;
            }






            // /*入力されたデータの確認用
            // console.log(receivedTime);
            // console.log(receivedStringName);
            // console.log(receivedStringDish);
            // console.log(receivedStringExplanation);
            // console.log(receivedAttachment);
            // */

            const embedFood = new EmbedBuilder()
                .setTitle("飯テロです")
                .setAuthor({
                    name: "food_terror",
                })
                .setDescription(`投稿者:${sendStringName}`)
                .setFields([
                    {
                        name: sendStringDish,
                        value: sendStringExplanation,
                    },
                ])
                .setImage(receivedAttachment.url);

            // receivedTimeの加工
            if (receivedTime == null) {
                await interaction.reply({ embeds: [embedFood]});
                return;
            }

            // 前:月日付時間分
            // 後:分時間日付月
            const arrayTime = receivedTime.split("-");
            console.log(arrayTime);
            const remakeTime = `00 ${arrayTime[3]} ${arrayTime[2]} ${arrayTime[1]} ${arrayTime[0]} *`;
            console.log(remakeTime);

            await interaction.reply("おｋ");

            // const task = await
            await cron.schedule(`${remakeTime}`, async () => {
                // await client.channels.cache.get(config.get("channel")).send({ embeds: [embedFood] });
                await interaction.client.channels.cache.get(`${interaction.channelId}`).send({ embeds: [embedFood] });
                console.log("schedule通りです");
            });

            console.log(interaction);
        },
    },
];

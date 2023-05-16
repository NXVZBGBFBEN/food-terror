/** @format */

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default [
    {
        data: new SlashCommandBuilder()
            .setName("food_add")
            .setDescription("画像を登録し、指定した時間に投稿します。")
            // .addNumberOption(option => option.setName("日時").setDescription("飯テロする日時をyyyymmddの形式で指定できます。").setRequired(false))
            .addStringOption((option) => option.setName("説明").setDescription("画像についての説明を書けます").setRequired(false))
            .addStringOption((option) => option.setName("投稿者").setDescription("投稿者の名前を入力できます").setRequired(false))
            .addStringOption((option) => option.setName("料理名").setDescription("料理名を入力できます").setRequired(false))
            .addAttachmentOption((option) => option.setName("画像").setDescription("ファイルを添付できます").setRequired(false)),

        async execute(interaction) {
            // const receivedNumber = interaction.option.getNumber("日時");
            const receivedStringName = interaction.options.getString("投稿者");
            const receivedStringDish = interaction.options.getString("料理名");
            const receivedStringExplanation = interaction.options.getString("説明");
            const receivedAttachment = interaction.options.getAttachment("画像");

            // /*入力されたデータの確認用
            // console.log(receivedNumber);
            // console.log(receivedStringName);
            // console.log(receivedStringDish);
            // console.log(receivedStringExplanation);
            console.log(receivedAttachment);
            // */

            const embedFood = new EmbedBuilder()
                .setTitle("飯テロです")
                .setAuthor({
                    name: "food_terror",
                })
                .setDescription(`投稿者:${receivedStringName}`)
                .setFields([
                    {
                        name: receivedStringDish,
                        value: receivedStringExplanation,
                    },
                ])
                .setImage(receivedAttachment.url);

            await interaction.reply({ embeds: [embedFood] });
        },
    },
];

/** @format */

import { SlashCommandBuilder } from "discord.js";

export default [
    {
        data: new SlashCommandBuilder()
            .setName("food_add")
            .setDescription("画像を登録し、指定した時間に投稿します。")
            //.addNumberOption(option => option.setName("日時").setDescription("飯テロする日時をyyyymmddの形式で指定できます。").setRequired(false))
            .addStringOption((option) => option.setName("説明").setDescription("画像についての説明を書けます").setRequired(false))
            .addAttachmentOption((option) => option.setName("画像").setDescription("ファイルを添付できます").setRequired(false)),

        async execute(interaction) {
            //const receivedNumber = interaction.option.getNumber("日時");
            const receivedString = interaction.options.getString("説明");
            const receivedAttachment = interaction.options.getAttachment("画像");

            //入力されたデータの確認用
            //console.log(receivedNumber);
            console.log(receivedString);
            console.log(receivedAttachment);

            await interaction.reply(receivedString);
            await interaction.reply(receivedAttachment);
        },
    },
];

/** @format */

import {SlashCommandBuilder} from "discord.js";

export default [
    {
        data: new SlashCommandBuilder().setName("food_snap").setDescription("[開発中] 登録済みの飯テロを選択して即時送信します"),
        async execute(interaction) {
            interaction.reply({content: "実装されていません", ephemeral:true});
        },
    },
];

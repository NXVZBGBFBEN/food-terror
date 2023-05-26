/** @format */

import {SlashCommandBuilder} from "discord.js";

export default [
    {
        data: new SlashCommandBuilder().setName("food_delete").setDescription("登録済みの飯テロを選択して削除します"),
        async execute(interaction) {
            interaction.reply("実装されていません");
        },
    },
];

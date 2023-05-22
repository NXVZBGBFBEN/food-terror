/** @format */

import {SlashCommandBuilder} from "discord.js";

export default [
    {
        data: new SlashCommandBuilder().setName("food_list").setDescription("[管理者専用] 登録済みの飯テロ一覧を表示します"),
        async execute(interaction) {
            interaction.reply("実装されていません");
        },
    },
];

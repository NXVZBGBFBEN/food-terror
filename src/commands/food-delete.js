/** @format */

import {SlashCommandBuilder} from "discord.js";

export default [
    {
        data: new SlashCommandBuilder().setName("food_delete").setDescription("[開発中] 登録済みの飯テロを選択して削除します"),
        async execute(interaction) {
            interaction.reply({content: "実装されていません", ephemeral: true});
        },
    },
];

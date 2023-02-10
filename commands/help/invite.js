const { EmbedBuilder, ButtonStyle } = require("discord.js");
module.exports = class Pause extends Interaction {
    constructor() {
        super({
            name: "invite",
            description: "Get the links",
        });
    }

    async exec(int, data) {
        const  { ActionRowBuilder, ButtonBuilder } = require("discord.js");
        const btn1 = new ButtonBuilder()
          .setLabel("Support")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/jbPyXjss");

        const btn2 = new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`);

        let buttonList = [btn1, btn2];
        const row = new ActionRowBuilder().addComponents(buttonList);

        const invite = new EmbedBuilder().setDescription(`**Click the button to redirect**`)
        .setColor("#FFFFFF");

        return int.followUp({
            embeds: [invite],
            components: [row],
            ephemeral: false,
        });
    }
};
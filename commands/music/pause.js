const { EmbedBuilder, ButtonStyle } = require("discord.js");
module.exports = class Pause extends Interaction {
    constructor() {
        super({
            name: "pause",
            description: "Pause the music",
        });
    }

    async exec(int, data) {

        const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
        const btn1 = new ButtonBuilder()
          .setLabel("Support")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.gg/jbPyXjss`);

        const btn2 = new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(ButtonStyle.Link)
          .setURL(
            `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`
          );

        let buttonList = [btn1, btn2];

        const row = new ActionRowBuilder().addComponents(buttonList);

        const novc = new EmbedBuilder()
          .setDescription(
            `**You should be in a voice channel!**`)
          .setColor(`#FFFFFF`);

        const novcs = new EmbedBuilder()
          .setDescription(
            `**You should be in a my voice channel!**`)
          .setColor(`#FFFFFF`);

        const nodj = new EmbedBuilder()
          .setDescription(
            `**You should be a DJ or Alone in Voice Channel!**`)
          .setColor(`#FFFFFF`);

        const nomusic = new EmbedBuilder()
          .setDescription(
            `**Nothing is playing in this server!** \nUse: \`/play\` song/url to play a music.`
          )
          .setColor(`#FFFFFF`);

        const pause = new EmbedBuilder()
          .setDescription(
            `**Song is now paused!** \nUse: \`/resume\` to resume a music.`
          )
          .setColor(`#FFFFFF`);

        const already = new EmbedBuilder()
          .setDescription(
            `**Song is already paused!** \nUse: \`/resume\` to resume a music.`
          )
          .setColor(`#FFFFFF`);

        let channel = int.member.voice.channel;


        if (!channel) return int.followUp({
            embeds: [novc],
            components: [row],
            ephemeral: false,
        });

        try {
          const channel1 = int.guild.me.voice.channel;
          if (
            channel1 &&
            channel !== channel1
          )
            return int.followUp({
              embeds: [novcs],
              ephemeral: false,
            });
        } catch {}

        

        let isDJ = data.djRoles.some((r) => int.member._roles.includes(r));
        let isAllowed = data.voiceChannels.find((c) => c === channel.id);
        let members = channel.members.filter((m) => !m.user.bot);

        if (data.voiceChannels.length > 0 && !isAllowed) {
            return int.followUp({
                content: `You must be in one of the allowed voice channels to use this command.`,
                ephemeral: true,
            });
        }

        if ( members.size > 1 && !isDJ && !int.member.permissions.has("MANAGE_GUILD")
        ) {
            return int.followUp({
                embeds: [nodj],
                components: [row],
                ephemeral: false,
            });
        }

        let hasQueue = this.client.player.hasQueue(int.guild.id);
        if (!hasQueue)
            return int.followUp({
                embeds: [nomusic],
                components: [row],
                ephemeral: false,
            });
        let queue = this.client.player.getQueue(int.guild.id);
        if (queue.paused) {
            return int.followUp({
                embeds: [already],
                ephemeral: false,
            });
        } else {
            queue.setPaused(true);
            return int.followUp({
                embeds: [pause],
                ephemeral: false,
            });
        }
    }
};
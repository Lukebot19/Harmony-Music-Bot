const { EmbedBuilder, ButtonStyle } = require("discord.js");
module.exports = class Last extends Interaction {
    constructor() {
        super({
            name: "last",
            description: "Adds the recently played song to the queue",
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

        const ltrack = new EmbedBuilder()
          .setDescription(
            `**There isn't any last song!** \n `)
          .setColor(`#FFFFFF`);

        const added = new EmbedBuilder()
          .setDescription(
            `**Added recently played song in queue!!**`)
          .setColor(`#FFFFFF`);

        let channel = int.member.voice.channel;
        if (!channel) 
            return int.followUp({
                embeds: [novc],
                components: [row],
                ephemeral: false,
            });
        try{
          const channel1 = int.guild.me.voice.channel
          if (channel1 && channel !== channel1)
            return int.followUp({
              embeds: [novcs],
              ephemeral: false,
            });
        } catch {

        }
        

        let hasQueue = this.client.player.hasQueue(int.guild.id);
        if (!hasQueue) {
            return int.followUp({
                embeds: [nomusic],
                components: [row],
                ephemeral: false,
            });
        }

        let queue = this.client.player.getQueue(int.guild.id);

        let lastTrack = queue.lastTrack;
        if (!lastTrack) {
            return int.followUp({
                embeds: [ltrack],
                ephemeral: false,
            });
        } else {
            int.followUp({
                embeds: [added],
                ephemeral: false,
            });

            return this.client.play(this.client,
                int,
                data,
                lastTrack,
                "youtube",
                false,
                false,
                true
                );
        }
    }
};
const { EmbedBuilder } = require("discord.js");
module.exports = class Skip extends Interaction {
  constructor() {
    super({
      name: "skip",
      description: "Skips the current track",
    });
  }

  async exec(int, data) {
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

    const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
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

    let channel = int.member.voice.channel;

    if (!channel)
      return int.followUp({
        embeds: [novc],
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

    let isAllowed = data.voiceChannels.find((c) => c === channel.id);

    if (data.voiceChannels.length > 0 && !isAllowed) {
      return int.followUp({
        content: `You must be in one of the allowed voice channels to use this command!`,
        ephemeral: true,
      });
    }

    let queue = this.client.player.getQueue(int.guild.id);
    if (!queue || !queue.nowPlaying)
      return int.followUp({
        embeds: [nomusic],
        components: [row],
        ephemeral: false,
      });

    let isDJ = data.djRoles.some((r) => int.member._roles.includes(r));
    let members = channel.members.filter((m) => !m.user.bot);

    if (
      members.size > 1 &&
      !isDJ &&
      !int.member.permissions.has("MANAGE_GUILD")
    ) {
      let required = members.size === 2 ? 2 : Math.ceil(members.size / 2);

      if (queue.skipVotes.includes(int.user.id)) {
        return int.followUp({
          content: "You've already voted to skip the current track!",
          ephemeral: true,
        });
      }

      queue.skipVotes.push(int.user.id);
      int.followUp({
        content: `You voted to skip the current track! **${queue.skipVotes.length}/${required}**`,
      });

      if (queue.skipVotes.length >= required) {
        queue.skipVotes = [];
        let skipped = queue.skip();

        const donee = new EmbedBuilder()
          .setDescription(
            `**Skipped ${skipped.name
              .split(" ")
              .slice(0, 5)
              .join(" ")}!**`)
          .setColor(`#FFFFFF`);

        int.followUp({
          embeds: [donee],
          ephemeral: false,
        });
      }
    } else {
      queue.skipVotes = [];
      let skipped = queue.skip();

      const done = new EmbedBuilder()
        .setDescription(
          `**Skipped ${skipped.name
            .split(" ")
            .slice(0, 5)
            .join(" ")}!**`)
        .setColor(`#FFFFFF`);

      int.followUp({
        embeds: [done],
        ephemeral: false,
      });
    }
  }
};

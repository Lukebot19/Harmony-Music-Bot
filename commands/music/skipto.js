const { EmbedBuilder } = require("discord.js");
module.exports = class SkipTo extends Interaction {
  constructor() {
    super({
      name: "skipto",
      description: "Skips to a specific track in the queue",
      options: [
        {
          type: 4,
          name: "song",
          description: "The position of the track in the queue",
          required: true,
        },
      ],
    });
  }

  async exec(int, data) {
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

    let number = int.options.getInteger("song");
    let channel = int.member.voice.channel;

    if (!channel)
      return int.followUp({
        embeds: [novc],
        ephemeral: false,
      });
    

    try {
      const channel1 = int.guild.me.voice.channel;
      if (channel1 && channel !== channel1)
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
        content: `You must be in one of the allowed voice channels to use this command!`,
        ephemeral: true,
      });
    }

    if (
      members.size > 1 &&
      !isDJ &&
      !int.member.permissions.has("MANAGE_GUILD")
    ) {
      return int.followUp({
        embeds: [nodj],
        components: [row],
        ephemeral: false,
      });
    }

    let queue = this.client.player.getQueue(int.guild.id);
    if (!queue)
      return int.followUp({
        embeds: [nomusic],
        components: [row],
        ephemeral: false,
      });

    const novalid = new EmbedBuilder()
      .setDescription(
        `**The number you provided is out of range!** \nUse: \`/play\` song/url to play a music.`
      )
      .setColor(`#FFFFFF`);

    if (number > queue.songs.length || number < 0)
      return int.followUp({
        embeds: [novalid],
        ephemeral: false,
      });

    let song;
    queue.songs.forEach((s, i) => {
      if (i === number) {
        song = s;
      }
    });

    await queue.skip(number - 1);
    const done = new EmbedBuilder()
      .setDescription(
        `**Skipped all the song above *${number}*!** \nPlaying: ${song.name
          .split(" ")
          .slice(0, 5)
          .join(" ")}`
      )
      .setColor(`#FFFFFF`);

    return int.followUp({
      embdes: [done],
      ephemeral: true,
    });
  }
};

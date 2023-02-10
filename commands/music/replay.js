const { EmbedBuilder } = require("discord.js");
module.exports = class Replay extends Interaction {
  constructor() {
    super({
      name: "replay",
      description: "Replays the current track",
    });
  }

  async exec(int, data) {
    let queue = this.client.player.getQueue(int.guild.id);
    const novc = new EmbedBuilder()
      .setDescription(
        `**You should be in a voice channel!** \n`)
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

    const done = new EmbedBuilder()
      .setDescription(
        `**Replaying __${queue.nowPlaying.name
          .split(" ")
          .slice(0, 5)
          .join(" ")}__ song!** \nUse: \`/stop\`to stop playing music!`
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

    if (!queue || !queue.nowPlaying)
      return int.followUp({
        embeds: [nomusic],
        components: [row],
        ephemeral: false,
      });

    await queue.seek(0);

    return int.followUp({
      embeds: [done],
      ephemeral: false,
    });
  }
};

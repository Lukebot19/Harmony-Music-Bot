const { EmbedBuilder } = require("discord.js");

module.exports = class Play extends Interaction {
  constructor() {
    super({
      name: "play",
      description: "Adds a song you want to play",
      options: [
        {
          type: 3,
          name: "input",
          description: "Gimme a song name, link or playlist link",
          required: true,
        },
        {
          type: 5,
          name: "force",
          description: "Ignore other song and play song now!",
          required: false,
        },
      ],
    });
  }

  async exec(int, data) {
    
    const {
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
      EmbedBuilder,
    } = require("discord.js");
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

    const song = int.options.getString("input");
    const force = int.options.getBoolean("force");

    let channel = int.member.voice.channel;

    const novc = new EmbedBuilder()
      .setDescription(
        `**You should be in a voice channel!**`)
      .setColor(`#FFFFFF`);

    const novcs = new EmbedBuilder()
      .setDescription(`**You should be in a my voice channel!**`)
      .setColor(`#FFFFFF`);

    const nodj = new EmbedBuilder()
      .setDescription(`**You should be a DJ or Alone in Voice Channel!**`)
      .setColor(`#FFFFFF`);
    
    if (!channel)
      return int.followUp({
        embeds: [novc],
        ephemeral: false,
      });
    try{
      const meChannel = int.guild.me.voice.channel;
      if (meChannel && channel !== mechannel)
        return int.followUp({
          embeds: [novcs],
          ephemeral: false,
        });
    } catch {
    }
    

    let isDJ = data.djRoles.some((r) => int.member._roles.includes(r));
    let isAllowed = data.voiceChannels.find((c) => c === channel.id);
    let members = channel.members.filter((m) => !m.user.bot);

    if (data.voiceChannels.length > 0 && !isAllowed) {
      return int.followUp({
        content: `You should be in one of the allowed voice channels!`,
        ephemeral: true,
      });
    }

    if (
      force &&
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

    // Spotify regex
    const spotifyTrackRegex =
      /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/track\/)(.*)$/;
    const spotifyPlaylistRegex =
      /^(https?:\/\/)?(www\.)?(open\.spotify\.com)\/playlist\/(.*)$/;
    const spotifyAlbumRegex =
      /^(?:https?:\/\/)?open\.spotify\.com\/album\/([a-zA-Z0-9]{22})(?:\S+)?/;

    // Apple Music regex
    const appleMusicPlaylistRegex =
      /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/playlists\/(.*)$/;
    const appleMusicAlbumRegex =
      /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/album\/(.*)$/;
    const appleMusicTrackRegex =
      /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/(.*)\/(.*)$/;

    // youtube regex
    const youtubePlaylistRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/playlist\?list=(.*)$/;
    const youtubeVideoRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch\?v=(.*)$/;

    // YouTube's music regex
    const youtubeMusicAlbumRegex =
      /^(https?:\/\/)?(music\.youtube\.com)\/playlist\?list=(.*)$/;
    const youtubeMusicTrackRegex =
      /^(https?:\/\/)?(music\.youtube\.com)\/watch\?v=(.*)$/;

    const isPlaylist =
      youtubePlaylistRegex.test(song) ||
      youtubeMusicAlbumRegex.test(song) ||
      spotifyPlaylistRegex.test(song) ||
      spotifyAlbumRegex.test(song) ||
      appleMusicPlaylistRegex.test(song) ||
      appleMusicAlbumRegex.test(song);

    let source;
    if (
      spotifyTrackRegex.test(song) ||
      spotifyAlbumRegex.test(song) ||
      spotifyPlaylistRegex.test(song)
    ) {
      source = "Spotify";
    } else if (
      appleMusicTrackRegex.test(song) ||
      appleMusicAlbumRegex.test(song) ||
      appleMusicPlaylistRegex.test(song)
    ) {
      source = "Apple";
    } else if (
      youtubeVideoRegex.test(song) ||
      youtubePlaylistRegex.test(song)
    ) {
      source = "YouTube";
    } else if (
      youtubeMusicTrackRegex.test(song) ||
      youtubeMusicAlbumRegex.test(song)
    ) {
      source = "YouTube";
    } else {
      source = "YouTube";
    }

    if (isPlaylist) {
      return this.client.play(
        this.client,
        int,
        data,
        song,
        source,
        true,
        false,
        false,
        false
      );
    } else {
      return this.client.play(
        this.client,
        int,
        data,
        song,
        source,
        false,
        false,
        false,
        force
      );
    }
  }
};

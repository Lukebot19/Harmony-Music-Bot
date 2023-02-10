const { EmbedBuilder, ButtonStyle } = require("discord.js");
const sf = require("seconds-formater");
const { progressBar } = require("../../player/functions/progress-bar");
const { msToSeconds } = require("../../utils/Utils");

module.exports = class NowPlaying extends Interaction {
    constructor() {
        super({
            name: "nowplaying",
            description: "Displays the currently playing song",
        });
    }

    async exec(int, data, client) {

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
            `**Nothing is playing in this server!**\nUse: \`/play\` song/url to play a music.`
          )
          .setColor(`#FFFFFF`);
        let channel = int.member.voice.channel;

        if (!channel) 
            return int.followUp({ embeds: [novc], components: [row], ephemeral: false });
         try {
           const channel1 = int.guild.me.voice.channel;
           if (
             channel1 &&
             channel !== channel1
           )
             return int.followUp({ embeds: [novcs], ephemeral: false });
         } catch {}

        
        let isAllowed = data.voiceChannels.find((c) => c === channel.id);
        if (data.voiceChannels.length > 0 && !isAllowed) {
            return int.followUp({ content: `You must be in one of the allowed voice channels to use this command!`, ephemeral: true });
        }

        let hasQueue = this.client.player.hasQueue(int.guild.id);
        if (!hasQueue) {
            return int.followUp({ embeds: [nomusic], components: [row], ephemeral: false });
        }

        let queue = this.client.player.getQueue(int.guild.id);

        let song = queue.nowPlaying;
        if (!song) {
            return int.followUp({ embeds: [nomusic], ephemeral: false });
        }

        let total = song.milliseconds;
        let stream = queue.connection.player._state.resource.playbackDuration;
        console.log(stream)
        let seconds = msToSeconds(stream);
        console.log(seconds)
        let time;
        if (seconds === 86400) {
            time = sf.convert(seconds).format("D day");
        } else if (seconds >= 3600) {
            time = sf.convert(seconds).format("H:MM:SS");
        } else {
          try {
            time = sf.convert(seconds).format("M:SS");
          } catch {
            time = 0;
          }
        }

        let np = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setDescription(`**Playing:** __${song.name.split(' ').slice(0,5).join(' ')}__\n\n${progressBar(
            total,
            stream,
            18,
            "▬"
        )} \n${time} / ${song.duration}`);

        return int.followUp({
            embeds: [np],
        });
    }
};
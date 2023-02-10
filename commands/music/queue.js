const paginationEmbed = require("../../utils/Pagination");
const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = class Queue extends Interaction {
    constructor() {
        super({
            name: "queue",
            description: "Show the queue",
        });
    }

    async exec(int, data) {
        const novc = new EmbedBuilder() .setDescription(`**You should be in a voice channel!**`)
  .setColor(`#FFFFFF`);

      const novcs = new EmbedBuilder() .setDescription(`**You should be in a my voice channel!**`)
  .setColor(`#FFFFFF`);

      const nodj = new EmbedBuilder() .setDescription(`**You should be a DJ or Alone in Voice Channel!**`)
  .setColor(`#FFFFFF`);

      const nomusic = new EmbedBuilder() .setDescription(`**Nothing is playing in this server!** \nUse: \`/play\` song/url to play a music.`)
  .setColor(`#FFFFFF`);

      
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
    if (!queue || !queue.songs.length)
      return int.followUp({
        embeds: [nomusic],
        ephemeral: false,
      });

    let btn1 = new ButtonBuilder()
      .setCustomId("previousbtn")
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary);

    const btn2 = new ButtonBuilder()
      .setCustomId("nextbtn")
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary);


      const btn3 = new ButtonBuilder()
        .setLabel(" ")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.gg/jbPyXjss`);
      

    let currentEmbedItems = [];
    let embedItemArray = [];
    let pages = [];

    let buttonList = [btn1, btn2, btn3];

    if (queue.songs.length > 11) {
      queue.songs.forEach((s, i) => {
        s.index = i;
        if (s.name !== queue.nowPlaying.name) {
          if (currentEmbedItems.length < 10) currentEmbedItems.push(s);
          else {
            embedItemArray.push(currentEmbedItems);
            currentEmbedItems = [s];
          }
        }
      });
      embedItemArray.push(currentEmbedItems);

      embedItemArray.forEach((x) => {
        let songs = x
          .map((s) => `[${s.index}. ${s.name.split(' ').slice(0, 6).join(' ')}](${s.url})`)
          .join(`\n`);
        let emb = new EmbedBuilder()
          .setTitle("Queue of Songs")
          .setColor("#FFFFFF")
          .setDescription(
`**Now playing:** \n*[${queue.nowPlaying.name.split(' ').slice(0, 7).join(' ')}](${queue.nowPlaying.url})*\n\n**Next Playing:**\n${songs}`
          );
        pages.push(emb);
      });

      await paginationEmbed(int, pages, buttonList);
    } else {
      let songs = queue.songs
        .map((s, i) => {
          if (s.name !== queue.nowPlaying.name) {
            return `[${i}. ${s.name}](${s.url})`;
          }
        })
        .join(`\n`);

      let emb = new EmbedBuilder()
        .setTitle("Queue of Songs")
        .setColor("#FFFFFF")
          .setDescription(
`**Now playing:** \n*[${queue.nowPlaying.name.split(' ').slice(0, 7).join(' ')}](${queue.nowPlaying.url})*\n\n**Next Playing:**\n${songs}`)
      return int.followUp({ embeds: [emb] });
    }
    }
};
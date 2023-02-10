const { EmbedBuilder } = require("discord.js");
const DMP = require("discord-music-player");

module.exports = class Search extends Interaction {
  constructor() {
    super({
      name: "search",
      description: "Search a song!",
      options: [
        {
          type: 3,
          name: "input",
          description: "song name",
          required: true,
        },
      ],
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

    const noresult = new EmbedBuilder()
      .setDescription(
        `**No results found!** \nUse: \`/play\` song/url to play a music.`
      )
      .setColor(`#FFFFFF`);

    const notime = new EmbedBuilder()
      .setDescription(
        `**You took too musch time to respond!** \nUse: \`/play\` song/url to play a music.`
      )
      .setColor(`#FFFFFF`);

    const input = int.options.getString("input");

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

    let isAllowed = data.voiceChannels.find((c) => c === channel.id);

    if (data.voiceChannels.length > 0 && !isAllowed) {
      return int.followUp({
        content: `You must be in one of the allowed voice channels to use this command!`,
        ephemeral: true,
      });
    }

    int.followUp({
      content: `Searching \`${input}\``,
    });

    let hasQueue = this.client.player.hasQueue(int.guild.id);
    let queue;
    if (!hasQueue) {
      queue = this.client.player.createQueue(int.guild.id);
      await queue.join(channel);
    } else {
      queue = this.client.player.getQueue(int.guild.id);
    }

    let results = await DMP.Utils.search(
      input,
      { requestedBy: int.user },
      queue,
      10
    ).catch((e) => {
      console.log(e);
    });

    if (!results) {
      if (!hasQueue) {
        await queue.stop();
      }

      return int.editReply({
        embeds: [noresult],
      });
    }

    let emb = new EmbedBuilder()
      .setTitle("Search Results")
      .setColor("#FFFFFF")
      .setDescription(
        `Which song do you want to listen? <Send song position number>\n\n` +
          results.map((r, i) => `[${i + 1}. ${r.name}](${r.url})`).join("\n")
      );

    await int.editReply({ content: " ", embeds: [emb] });

    let filter = (m) => m.author.id === int.user.id;
    let selection = await int.channel
      .awaitMessages({
        filter,
        max: 1,
        time: 30000,
        errors: ["time"],
      })
      .then((m) => {
        let select = m.first().content;

        m.first().delete();
        let song = results.find((r, i) => {
          if (i + 1 === Number(select.replace(/^\D+/g, ""))) {
            return r;
          }
        });

        if (!song) {
          return int.editReply({
            embeds: [noresult],
          });
        }

        int.deleteReply();

        return this.client.play(
          this.client,
          int,
          data,
          song,
          "youtube",
          false,
          true
        );
      })
      .catch(() => {
        return int.editReply({
          embeds: [notime],
        });
      });

    await selection;
  }
};

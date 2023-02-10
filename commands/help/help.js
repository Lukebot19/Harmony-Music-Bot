const { RepeatMode } = require("discord-music-player");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = class Loop extends Interaction {
  constructor() {
    super({
      name: "help",
      description: "Seee commands of the bot",
      options: [
        {
          type: 3,
          name: "category",
          description: "Choose which category",
          required: true,
          choices: [
            {
              name: "Music",
              value: "music",
            },
            {
              name: "Info",
              value: "info",
            },
          ],
        },
      ],
    });
  }

  async exec(int, data) {
    const btn1 = new ButtonBuilder()
      .setLabel("Support")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/jbPyXjss");

    const btn2 = new ButtonBuilder()
      .setLabel("Invite")
      .setStyle(ButtonStyle.Link)
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`
      );

    let btn3 = new ButtonBuilder()
      .setCustomId("playbtn")
      .setLabel("Play")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const btn4 = new ButtonBuilder()
      .setCustomId("stopbtn")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    let buttonList = [btn1, btn2];
    let buttons = [btn3, btn4, btn1, btn2];

    const row = new ActionRowBuilder().addComponents(buttonList);
    const bmusic = new ActionRowBuilder().addComponents(buttons);

    const music = new EmbedBuilder()
      .setDescription(
        `__**Music Commands**__ \n
        \`/dj         :\` Modify your server DJ role \n
        \`/last       :\` Add a song previously finished in queue \n
        \`/loop       :\` Enable.Disable loop for queue/song \n
        \`/nowplaying :\` Show the song currently playing \n
        \`/pause      :\` Pause the current song \n
        \`/play       :\` Play/Add a song in VC/queue \n
        \`/playlist   :\` Modify your own playlist \n
        \`/queue      :\` Shows the songs playinh next \n
        \`/replay     :\` Play a song agan from the beginning \n
        \`/resume     :\` Resume the current paused song \n
        \`/search     :\` Find your exact song \n
        \`/shuffle    :\` Shuffle the queue \n
        \`/skip       :\` Skip the current song \n
        \`/skipto     :\` Skips all the songs upto your choice \n
        \`/volume     :\` Change the volume percentages \n
        \`/stop       :\` Stop the music and clear the queue \n`
      )

    const info = new EmbedBuilder()
      .setTitle(`${this.client.user.username} Info Commands`)
      .setDescription(
        `
        \`/help       :\` Shows the category commands\n`
      )
      .setColor(`#FFFFFF`);

    const category = int.options.getString("category");

    if (category === "music") {
      return int.followUp({
        embeds: [music],
        // components: [bmusic],
        ephemerall: false,
      });
    } else if (category == "info") {
      return int.followUp({
        embeds: [info],
        // components: [row],
        ephemerall: false,
      });
    }
  }
};

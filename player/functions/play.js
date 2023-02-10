const { EmbedBuilder } = require("discord.js");
module.exports = async function play(
  client,
  int,
  data,
  input,
  source,
  playlist = false,
  search = false,
  last = false,
  force = false
) {
  let guildQueue = client.player.hasQueue(int.guild.id);
  let queue;

  if (!guildQueue) {
    queue = client.player.createQueue(int.guild.id);
    queue.skipVotes = [];
  } else {
    queue = client.player.getQueue(int.guild.id);
  }
  // console.log("queue: ", queue)

  let channel = int.member.voice.channel;

  

  if (!search && !last) {
    int.followUp(
      `Searching \`${input}\` on ${source}...`
    );
  }

  queue.textChannel = int.channel;
  console.log("joining");
  await queue.join(channel).catch((err) => {console.log("there was an error", err)});
  console.log("joined");
  if (playlist) {
    let pl = await queue
      .playlist(input, { requestedBy: int.user })
      .catch((_, err) => {
        if (err) {
          console.log(err);
        }
        if (!queue) {
          queue.stop();
        }
      });
    const noplayl = new EmbedBuilder()
      .setDescription(
        `** I couldn't find that playlist!** \nSupport: [Server](https://discord.gg/jbPyXjss)`
      )
      .setColor(`#FFFFFF`);

    if (!pl)
      return int.channel.send({
        embeds: [noplayl],
      });
  } else {
    if (force) {
      let song = await queue
        .play(input, { index: 0, requestedBy: int.user })
        .catch((_, err) => {
          if (err) {
            console.log(err);
          }
          if (!queue) {
            queue.stop();
          }
        });

      const nosongg = new EmbedBuilder()
        .setDescription(
          `** I couldn't find that song!** \nSupport: [Join Server](https://discord.gg/jbPyXjss)`
        )
        .setColor(`#FFFFFF`);
      if (!song)
        return int.channel.send({
          embeds: [nosongg],
        });
      queue.skip();
    } else {
      console.log("Searching");
      let song = await queue
        .play(input, { requestedBy: int.user })
        .catch(err => {
          
          console.log(err);
          
          if (!queue) {
            console.log("stopping")
            queue.stop();
          }
        });
      console.log("song: ", song)
      const nosonggg = new EmbedBuilder()
        .setDescription(
          `** I couldn't find that song!** \nSupport: [Join Server](https://discord.gg/jbPyXjss)`
        )
        .setColor(`#FFFFFF`);
      if (!song)
        return int.channel.send({
          embeds: [nosonggg],
        });
    }
  }
};

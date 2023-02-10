const { RepeatMode } = require("discord-music-player");
const { EmbedBuilder, ButtonStyle } = require("discord.js");
module.exports = class Loop extends Interaction {
    constructor() {
        super({
            name: "loop",
            description: "Loop the queue",
            options: [
                {
                    type: 3,
                    name: "mode",
                    description: "Loop mode",
                    required: true,
                    choices: [
                        {
                            name: "track",
                            value: "track",
                        },
                        {
                            name: "queue",
                            value: "queue",
                        },
                        {
                            name: "disable",
                            value: "disable",
                        },
                    ],
                },
            ],
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
            `**You should be in a voice channel!** \n`)
          .setColor(`#FFFFFF`);

        const novcs = new EmbedBuilder()
          .setDescription(
            `**You should be in a my voice channel!** \n`)
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
            `**Loop is enable for only current playing song!** \nUse: \`/loop\` disable to disable loop in a music.`
          )
          .setColor(`#FFFFFF`);

        const lqueue = new EmbedBuilder()
          .setDescription(
            `**Loop is enable for a whole queue!** \nUse: \`/loop\` disable to disable loop in a music.`
          )
          .setColor(`#FFFFFF`);

        const ldisable = new EmbedBuilder()
          .setDescription(
            `**Loop is disabled!**\nUse: \`/loop\` track/queue to loop a music.`
          )
          .setColor(`#FFFFFF`);

        const mode = int.options.getString("mode");
        let channel = int.member.voice.channel
        if (!channel) return int.followUp({ embeds: [novc], components: [row], ephemeral: false });

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
        

        let isDJ = data.djRoles.some((r) => int.member._roles.includes(r));
        let isAllowed = data.voiceChannels.find((c) => c === channel.id);
        let members = channel.members.filter((m) => !m.user.bot);

        if (data.voiceChannels.length > 0 && !isAllowed) {
            return int.followUp({
                content: `You must be in one of the allowed voice channels to use this command!`,
                ephemeral: true,
            });
        }

        if (members.size > 1 && !isDJ && !int.member.permissions.has("MANAGE_GUILD")) {
            return int.followUp({
                embeds: [nodj],
                ephemeral: false,
            });
        }

        let queue = this.client.player.getQueue(int.guild.id);

        if (mode === "track") {
            if (queue.repeatMode === RepeatMode.SONG) {
                return int.followUp({
                    content: "The current song is already looped!",
                    ephemeral: true,
                });
            } else {
                queue.setRepeatMode(RepeatMode.SONG);
                return int.followUp({
                    embeds: [ltrack],
                    ephemeral: false,
                });
            }
        } else if (mode === "queue") {
            if (queue.repeatMode === RepeatMode.QUEUE) {
                return int.followUp({
                    content: "The queue is already looped!",
                    ephemeral: true,
                });
            } else {
                queue.setRepeatMode(RepeatMode.QUEUE);
                return int.followUp({
                    embeds: [lqueue],
                    ephemeral: false,
                });
            }
        } else if (mode === "disable") {
            if (queue.repeatMode === RepeatMode.DISABLED) {
                return int.followUp({
                    content: "The loop is already disabled!",
                    ephemeral: true,
                });
            } else {
                queue.setRepeatMode(RepeatMode.DISABLED);
                return int.followUp({
                    embeds: [ldisable],
                    ephemeral: false,
                });
            }
        }
    }
};
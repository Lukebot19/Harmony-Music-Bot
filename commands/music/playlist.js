const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const paginationEmbed = require("../../utils/Pagination");
const users = require("../../models/Users");

module.exports = class Fav extends Interaction {
    constructor() {
        super({
            name: "playlist",
            description: "Save your favorite songs in your own custom playlist",
            options: [
                {
                    type: 1,
                    name: "add",
                    description: "Add the current playing song to your playlist",
                },
                {
                    type: 1,
                    name: "remove",
                    description: "Remove a song from your playlist",
                    options: [
                        {
                            type: 3,
                            name: "song",
                            description: "The song position number you want to remove",
                            required: true,
                        },
                    ]
                },
                {
                    type: 1,
                    name: "list",
                    description: "Your playlist song list",
                },
                {
                    type: 1,
                    name: "play",
                    description: "Play your playlist",
                    options: [
                        {
                            type: 4,
                            name: "song",
                            description: "Song position number to add in queue",
                            required: true,
                        },
                    ]
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

        const nomusic = new EmbedBuilder()
          .setDescription(
            `**Nothing is playing in this server!** \nUse: \`/play\` song/url to play a music.`
          )
          .setColor(`#FFFFFF`);

        const salready = new EmbedBuilder()
          .setDescription(
            `**This song is already in your playlist!** \nUse: \`/search\` to search a music.`
          )
          .setColor(`#FFFFFF`);

        const snot = new EmbedBuilder()
          .setDescription(
            `**This song is not in your playlist!** \nUse: \`/search\` to search a music.`
          )
          .setColor(`#FFFFFF`);

        let channel = int.member.voice.channel;

        if (!channel) return int.followUp({embeds: [novc], ephemeral: false});

        try {
          const channel1 = int.guild.me.voice.channel;
          if (
            channel1 &&
            channel !== channel1
          )
            return int.followUp({ embeds: [novcs], ephemeral: false });
        } catch {}

        

        const cmd = int.options.getSubcommand();

        let user = await users.findOne({
            _id: int.user.id,
        });

        if (!user) {
            user = new users({
                _id: int.user.id,
                savedSongs: [],
            });
        }

        if (cmd === "add") {
            let hasQueue = this.client.player.hasQueue(int.guild.id);
            if (!hasQueue) {
                return int.followUp({embeds: [nomusic], ephemeral: false});
            }

            let queue = this.client.player.getQueue(int.guild.id);

            let song = queue.nowPlaying;
            if (!song) {
                return int.followUp({embeds: [nomusic], ephemeral: false});
            }

            let old = user.savedSongs.find((r) => r.name === song.url);

            if (old) {
                return int.followUp({embeds: [salready], ephemeral: false});
            }

            user.savedSongs.push({name:song.name, url:song.url});
            await user.save();

            const sadded = new EmbedBuilder().setDescription(`**Added __${song.name.split(' ').slice(0,5).join(' ')}__ in your playlist!**\n\nUse: \`/playlist play\` to play your playlist songs.`)
            .setColor(`#FFFFFF`);

            return int.followUp({embeds: [sadded], ephemeral: false});
        }
        if (cmd === "remove") {
            let index = int.options._hoistedOptions[0].value;

            let old = user.savedSongs.find((s, i) => i === index -1);
            
            const noplay = new EmbedBuilder().setDescription(`**This song isnot in your playlist¬**`)
            .setColor(`#FFFFFF`);

            if (!old) return int.followUp({embeds: [noplay], ephemeral: false});

            user.savedSongs.splice(index - 1, 1);
            await user.save();

            const sremoved = new EmbedBuilder().setDescription(`**Removed __${old.name.split(' ').slice(0,5).join(' ')}__ from your playlist!**`).setColor(`#FFFFFF`);

            return int.followUp({embeds: [sremoved], ephemeral: false});
        }
        if (cmd === "list") {
            let sng = user.savedSongs;

            if (!sng.length) return int.followUp({content: "You don't have any songs in the playlist!", ephemeral: true});
            
            let btn1 = new ButtonBuilder().setCustomId("previousbtn").setLabel("Previous").setStyle(ButtonStyle.Secondary);
            let btn2 = new ButtonBuilder().setCustomId("nextbtn").setLabel("Next").setStyle(ButtonStyle.Secondary);

            let currentEmbedItems = [];
            let embedItemArray = [];
            let pages = [];

            let buttonList = [btn1, btn2];

            if (sng.length > 10) {
                sng.forEach((s,i) => {
                    s.index = i + 1;
                    if (currentEmbedItems.length < 10) currentEmbedItems.push(s);
                    else {
                        embedItemArray.push(currentEmbedItems);
                        currentEmbedItems = [s];
                    }
                });
                embedItemArray.push(currentEmbedItems);
                embedItemArray.forEach((x) => {
                    let emb = new EmbedBuilder()
                    .setTitle(`${int.user.username} Playlist Songs`)
                    .setThumbnail(int.user.displayAvatarURL({size:2048, dynamic: true}))
                    .setColor(`#FFFFFF`)
                    .setDescription(`${x.map((s) => `[${s.index}. ${s.name}](${s.url})`).join("\n")}`)
                    .setTimestamp();
                    pages.push(emb);
                });

                await paginationEmbed(int, pages, buttonList);
            } else {
                let emb = new EmbedBuilder()
                .setTitle(`${int.user.username} Playlist Songs`)
                .setThumbnail(int.user.displayAvatarURL({size:2048, dynamic: true}))
                .setColor(`#FFFFFF`)
                .setDescription(`${sng.map((s, i) => `[${i + 1}. ${s.name}](${s.url})`).join("\n")}`)
                .setTimestamp();
                return int.followUp({embeds: [emb]});
            }
        }
        if (cmd === "play") {
            let index = int.options._hoistedOptions[0].value;

            let sng = user.savedSongs.find((s,i) => i + 1 === Number(index));
            if (!sng) return int.followUp({embeds: [snot], ephemeral: false});

            const done = new EmbedBuilder().setDescription(`**Playing __${sng.name.split(' ').slice(0,5).join(' ')}__!**`)
            .setColor(`#FFFFFF`);

            await int.followUp({embeds: [done], ephemeral: true});

            return this.client.play(this.client, int, data, sng.url, "youtube", false, true, false, false);
        }
    }
};
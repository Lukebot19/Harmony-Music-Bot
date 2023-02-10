const { msToSeconds } = require("../../utils/Utils");
const sf = require("seconds-formater");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { Canvas } = require("canvas-constructor/cairo");
const canvas = require("canvas");
const { registerFont } = require("canvas");
registerFont("../code/fonts/Open Sans.ttf", { family: "Open Sans" });
registerFont("../code/fonts/Montserrat.ttf", { family: "Ope" });
module.exports = class SongAdd extends Event {
    constructor() {
        super({
            name: "songAdd",
            once: false,
        });
    }

    async exec(queue, song) {
        let channel = queue.textChannel;
        let user = song.requestedBy;

        if (channel) {
            let timeLeft;
            if (queue.nowPlaying.name !== song.name) {
                let estimate = 0;
                queue.songs.forEach((s) => {
                    if (s.name !== song.name) {
                        estimate += s.milliseconds;
                    }
                });

                let stream = queue.nowPlaying.isLive
                    ? 0
                    : queue.connection.player._state.resource.playbackDuration;

                let seconds = msToSeconds(estimate - stream);

                if (seconds === 86400) {
                    timeLeft = sf.convert(seconds).format("D day");
                } else if (seconds >= 3600) {
                    timeLeft = sf.convert(seconds).format("H:MM:SS");
                } else {    
                    timeLeft = sf.convert(seconds).format("M:SS");
                }
            } else {
                timeLeft = "Now";
            }

            let emb;
            if (queue.songs.indexOf(song) === 1 && queue.songs.length > 2) {
                let names = song.name.split(' ').slice(0,5).join(` `);
                const image = await canvas.loadImage(
                  __dirname + "/ipploplayerq.png"
                );
                const imagge = await canvas.loadImage(song.thumbnail);

                let imaggee = new Canvas(605,190)
                .printImage(image,0,0,605,190)
                .setColor("#000000")
                .setTextFont('16px Open sans')
                .setTextAlign("center")
                .prntWrapperText(names, 260,43)
                .setTextFont('14px Ope')
                .printWrappedText(song.author, 360, 63)
                .printRectangle(47,28,150,90)
                .printImage(imagge, 47,28,150,90)
                .setTextFont('20px Ope')
                .printWrappedText(song.duration, 541,168)
                .toBuffer();

                emb = new AttachmentBuilder(imaggee, 'supreme-ipplo.png');
            } else {
                let namee = song.name.split(" ").slice(0, 5).join(` `);
                const img = await canvas.loadImage(__dirname + "/ipploplayer.png");

                const imgg = await canvas.loadImage(song.thumbnail);

                let image = new Canvas(605, 190)
                  .printImage(img, 0, 0, 605, 190)
                  .setColor("#000000")
                  .setTextFont("16px Open Sans")
                  .setTextAlign("center")
                  .printWrappedText(namee, 360, 43)
                  .setTextFont("14px Ope")
                  .printWrappedText(song.author, 360, 63)
                  .printRectangle(47, 28, 150, 90)
                  .printImage(imgg, 47, 28, 150, 90)
                  .setTextFont("20px Ope")
                  .printWrappedText(song.duration, 541, 168)
                  .toBuffer();
                  emb = new AttachmentBuilder(image, "supreme-ipplo.png");

                if ((queue.songs.length -1) !== 0) {
                    let name = song.name.split(' ').slice(0,5).join(` `);
                    const img = await canvas.loadImage(
                      __dirname + "/ipploplayerq.png"
                    );
                    const imgg = await canvas.loadImage(song.thumbnail);

                    let image = new Canvas(605, 190)
                        .printImage(img, 0, 0, 605, 190)
                        .setColor("#000000")
                        .setTextFont('16px Open Sans')
                        .setTextAlign("center")
                        .printWrappedText(namee, 360, 43)
                        .setTextFont('14px Ope')
                        .printWrappedText(song.author, 360, 63)
                        .printRectangle(47, 28,150, 90)
                        .printImage(imgg, 47, 28,150, 90)
                        .setTextFont('20px Ope')
                        .printWrappedText(song.duration, 541, 168)
                        // .setColor("#000000")
                        .toBuffer();
                    emb = new AttachmentBuilder(image, 'supreme-ipplo.png');
                }
            }
            channel.send({files:[emb]});
        }
    }
};
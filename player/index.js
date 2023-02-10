const { Player } = require("discord-music-player");
const play = require("./functions/play");
const { sync } = require("glob");
const glob = require("glob");
const { resolve} = require("path");

async function player(client) {
    client.player = new Player(client, {
        leaveOnEmpty: false,
        deafenOnJoin: true,
    });

    let player = client.player;
    client.play = play;

    const dir = "../code/player/events";
    glob(dir + '/*.js', (err, files) => {
        if (err) {
            console.log('Eror', err)
        }
        const evtFile = files;
        evtFile.forEach((filepath) => {
            filepath = "../" + filepath;
            const File = require(filepath);
            if (!(File.prototype instanceof Event)) return;
            const event = new File();

            player.on(event.name, (...args) => event.exec(...args, client));
        });
    });

    player.on("error", (error, queue) => {
        client.logger.error(
            `There was an error with the music player`,
            {tag: "Player"}
        );
    });
}

module.exports = player;
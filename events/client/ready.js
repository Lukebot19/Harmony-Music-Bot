const { ActivityType } = require("discord.js");

module.exports = class Ready extends Event {
  constructor() {
    super({
      name: "ready",
      once: false,
    });
  }

  async exec() {
    this.client.user.setStatus("online");

    this.client.user.setActivity(`/help`, { type: ActivityType.Playing });

    let allMembers = new Set();
    this.client.guilds.cache.forEach((guild) => {
      guild.members.cache.forEach((member) => {
        allMembers.add(member.user.id);
      });
    });

    let allChannels = new Set();
    this.client.guilds.cache.forEach((guild) => {
      guild.channels.cache.forEach((channel) => {
        allChannels.add(channel.id);
      });
    });

    this.client.logger.log(`${this.client.user.tag} is online!`, {
      tag: "Ready",
    });

    // const guild = await this.client.guilds.fetch(process.env.EMOJIS_GUILD_ID)
    // if (guild) {
    //     await this.client.loadEmotes(guild).then(() => {
    //         this.client.logger.log("Ready to go!", {tag: "Emotes"});
    //     });
    // }
    // for (const guild of this.client.guilds.cache.values()) {
    //   await this.client.loadInteractions(guild.id);
    // }
    await this.client.loadInteractions();
  }
};

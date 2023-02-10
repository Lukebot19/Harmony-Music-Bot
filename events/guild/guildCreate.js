module.exports = class GuildCreate extends Event {
    constructor() {
        super({
            name: "guildCreate",
            once: false,
        });
    }

    async exec(guild) {
        await this.client.getGuild({_id: guild.id});
        await this.client.loadInteractios(guild.id);

        this.client.logger.log(`Add in server ${guild.name} (${guild.id})!`, {
            tag: "guildCreate",
        });
    }
};
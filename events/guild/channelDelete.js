module.exports = class ChannelDelete extends Event {
    constructor() {
        super({
            name: "channelDelete",
            once: false,
        });
    }

    async exec(channel) {
        const data = await this.client.getGuild({_id: channel.guild.id});

        if (data.voiceChannels.length > 0) {
            let odd = data.voiceChannels.find((c) => c === channel.id);
            if (odd) {
                let index = data.voiceChannels.indexOf(channel.id);
                data.voiceChannels.splice(index,1);
                await data.save().then(() => {
                    this.client.logger.warn(`Voice channel ${channel.name} (${channel.id}) removed from ${channel.guild.name} allowed chanels`, {tag: "channelDelete"});
                });
            }
        }
    }
}
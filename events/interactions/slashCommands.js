module.exports = class SlashCommands extends Event {
    constructor() {
        super({
            name: "slashCommands",
            once: false,
        });
    }

    async exec(interaction, data) {
        const cmd = this.client.interactions.get(interaction.commandName);

        if (!cmd) return;

        try {
            await interaction.deferReply({ ephemeral: true });
            await cmd.exec(interaction, data);
        } catch (err) {
            if (interaction.replied || interaction.deferred) {
                if (!interaction.ephemeral) {
                    await interaction.editReply({
                        content: "Oops! New Error again please report this in our support server.",
                    });
                } else {
                    interaction.channel.send({
                        content: "Oops! New error again please report this in our support server.",
                    });
                }
            } else {
                interaction.reply({
                    ephemeral: true,
                    content: "Oops! New error again please report this in our support server.",
                });
            }
            return this.client.logger.error(
                `\n Error occoured while trying to trigger slashCommands\n${
                    err.stack ? err + "\n\n" + err.stack : err
                }`,
                {
                    tag: "Interaction",
                }
            );
        }
    }
};
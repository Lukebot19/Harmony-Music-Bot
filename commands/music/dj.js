const { EmbedBuilder } = require("discord.js");

module.exports = class Pause extends Interaction {
    constructor() {
        super({
            name: "dj",
            description: "Give DJ permission",
            options: [
                {
                    type: 1,
                    name: "add",
                    description: "Add a role to the DJ roles list",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Add DJ role",
                            required: true,
                        },
                    ]
                },
                {
                    type: 1,
                    name: "remove",
                    description: "Remove a role from the DJ roles list",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "Remove DJ role",
                            required: true,
                        },
                    ]
                },
                {
                    type: 1,
                    name: "list",
                    description: "List all DJ roles",
                },
            ],
        });
    }

    async exec(int, data) {
        if (!int.member.permissions.has("MANAGE_GUILD"))
            return int.followUp({
                content: "You don't have the required permissions to do this!",
                ephemeral: true,
            });
        const cmd = int.options.getSubcommand()

        if (cmd === "add") {
            let role = int.options._hoistedOptions[0].role
            if (role.id === int.guild.id) {
                return int.followUp({
                    content: "The *everyone* role is not manageable!",
                    ephemeral: true,
                });
            }
            let old = data.djRoles.find((r) => r === role.id);

            if (old) {
                return int.followUp({
                    content: `The role ${role.name} is already in the list!`,
                    ephemeral: true,
                });
            }

            data.djRoles.push(role.id);
            await data.save();
            const djadded = new EmbedBuilder().setDescription(`**Added <@${role.id}> role to the DJ roles list!**`)
            .setColor(`#FFFFFF`);

            return int.followUp({
                embeds: [djadded],
                ephemeral: false,
            });
        }
        if (cmd === "remove") {
            let role = int.options._hoistedOptions[0].role;

            if (role.id === int.guild.id) {
                return int.followUp({
                    content: "Everyone role can't be in DJ role list!",
                    ephemeral: true,
                });
            }

            let old = data.djRoles.find((r) => r === role.id);

            if (!old) {
                return int.followUp({
                    content: `The role ${role.name} is not in the list!`,
                    ephemeral: true,
                });
            }

            let index = data.djRoles.indexOf(role.id);
            data.djRoles.splice(index, 1);
            await data.save();

            const djremove = new EmbedBuilder().setDescription(`**Removed <@${role.id}> role from the DJ roles list!**`)
            .setColor(`#FFFFFF`);

            return int.followUp({
                embeds: [djremove],
                ephemeral: false,
            });
        }
        if (cmd === "list") {
            let djs = data.djRoles;

            if (!djs.length)
                return int.followUp({
                    content: "there are no DJ roles yet!",
                    ephemeral: true,
                });

                let emb = new EmbedBuilder()
                .setTitle("DJ Role List")
                .setColor(`#FFFFFF`)
                .setDescription(`${djs.map((m) => `<@&${m}>`).join(" ")}`)
                .setTimestamp();

                return int.followUp({
                    embeds: [emb]
                });
            }
        }
    };

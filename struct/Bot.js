const { Client, Collection, GatewayIntentBits } = require("discord.js");
const {connect, connection:db} = require("mongoose");
const {Routes} = require("discord-api-types/v9");
const {REST} = require("@discordjs/rest");
const {resolve} = require("path");
const {sync} = require("glob");
const glob = require('glob');
require("./Interaction");
require("./Event");

module.exports = class Bot extends Client {
    constructor() {
        super({
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
          ],
          partials: ["MESSAGE", "REACTION"],
          allowedMentions: {
            parse: ["users", "roles"],
            repliedUser: true,
          },
        });

        this.events = new Collection();
        this.emotes = new Collection();
        this.logger = require("../utils/Logger");
        this.interactions = new Collection();

        this.database = {};
        this.guildsData = require("../models/Guilds");
        this.database.guilds = new Collection();

        db.on("connected", async () => 
            this.logger.log(`Connected to database! (Ping: ${Math.round(await this.databasePing())}ms)`,
            {tag: "Database"}
            )
        );
        db.on("disconnected", () => 
            this.logger.log("Disconnected from database!", 
            {tag: "Database"})
        );

        db.on("reconnected", async () =>
            this.logger.log(`Reconnected to database! (Ping: ${Math.round(await this.databasePing())}ms)`,
            {tag: "Database"}
            )
        );

    }

    async getGuild({_id: guildId}, check = false) {
        if (this.database.guilds.get(guildId)) {
            return check 
                ? this.database.guilds.get(guildId).toJSON()
                : this.database.guilds.get(guildId);
        } else {
            let guildData = check
                ? await this.guildsData.findOne({guildID: guildId}).lean()
                : await this.guildsData.findOne({guildID: guildId});
            if (guildData) {
                if (!check) this.database.guilds.set(guildId, guildData);
                return guildData;
            } else {
                guildData = new this.guildsData({_id: guildId});
                await guildData.save();
                this.database.guilds.set(guildId, guildData);
                return check ? guildData.toJSON() : guildData;
            }
        }
    }

    async loadDatabase() {
        let db_string =
          process.env.DB;
        return connect(db_string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    async databasePing() {
        const cNano = process.hrtime();
        await db.db.command({ping: 1});
        const time = process.hrtime(cNano);
        return (time[0] * 1e9 + time[1] * 1e-6);
    }

    async loadEmotes(guild) {
        if (guild) {
            await guild.emojis.fetch().then(emojis => {
                emojis.forEach(e => {
                    if (e.name.includes("_")) {
                        let name = e.name.replace("_", "-")
                        if (e.animated) {
                            this.emotes.set(name, `<${e,identifier}>`);
                        } else {
                            this.emotes.set(name, `<:${e.identifier}>`);
                        }
                    } else {
                        if (e.animated) {
                            this.emotes.set(e.name, `<${e.identifier}>`);
                        } else {
                            this.emotes.set(e.name, `<:${e.identifier}>`);
                        }
                    }
                })
            })
        }
    }

    async loadPlayer() {
        const player = require("../player/index.js");

        return player(this);
    }

    async loadInteractions() {
        const dir = "../code/commands/";
        glob(dir + '/**/*.js', (err, files) => {
            if (err) {
                console.log('Eror', err)
            }
            const intFile = files;
            console.log(intFile);
            const commands = [];
            intFile.forEach((filepath) => {
                filepath = "../" + filepath;
                const File = require(filepath);
                if (!(File.prototype instanceof Interaction)) return;
                const interaction = new File();
                interaction.client = this;
                this.interactions.set(interaction.name, interaction);
                commands.push({
                    name: interaction.name,
                    description: interaction.description,
                    options: interaction.options,
                    type: interaction.type,
                });

                
            });
            const rest = new REST({ version: "10" }).setToken(
              process.env.TOKEN
            );
            (async () => {
              try {
                console.log("Started refreshing application (/) commands.");

                await rest.put(
                  Routes.applicationCommands(process.env.CLIENT_ID),
                  {
                    body: commands,
                  }
                );
                console.log("Successfully reloaded application (/) commands.");
              } catch (error) {
                console.error(error);
              }
            })();
        });
    }

    async loadEvents() {
        const dir = '../code/events/'
       glob(dir + '/**/*.js', (err, files) => {
          if (err) {
            console.log('Eror', err)
          }
          const evtFile = files;
          evtFile.forEach((filepath) => {
            filepath = "../" + filepath;
            const File = require(filepath);
            if (!(File.prototype instanceof Event)) return;
            const event = new File();
            event.client = this;
            this.events.set(event.name, event);
            const emitter = event.emitter
              ? typeof event.emitter === "string"
                ? this[event.emitter]
                : emitter
              : this;
            emitter[event.type ? "once" : "on"](event.name, (...args) =>
              event.exec(...args)
            );
          });
        });
    }

    async start(token) {
        await this.loadEvents();
        console.log("loaded events")
        await this.loadDatabase();
        console.log("loaded db");
        await this.loadPlayer();
        return super.login(token);
    }
};
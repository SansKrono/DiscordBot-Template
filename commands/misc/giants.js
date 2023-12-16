/**
* @file Dynamic help command
* @author Naman Vrati
* @since 1.0.0
* @version 3.3.0
*/

// Deconstructing prefix from config file to use in help command
const { prefix } = require("./../../config.json");

// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder, ChannelType, bold } = require("discord.js");

// Loads the giants.json file to get team comps
const giantsDungeonData = require("./../../dungeon-teams/giants.json");

// Collection of embeds to send
const embeds = [];

/**
* @type {import('../../typings').LegacyCommand}
*/
module.exports = {
    name: "giants",
    description: "DMs the requestor with recommended giants teams.",
    aliases: ["GB10", "gb10", "giantsb10", "GiantsB10", "giant"],
    usage: "",
    cooldown: 5,
    
    async execute(message, args) {
        const { commands } = message.client;
        
        // If there are no arguments, send all giants teams.
        if (!args.length) {
            for (let i = 0; i < giantsDungeonData.teams.length; i++) {
                // Get team data from json file
                const teamData = giantsDungeonData.teams[i];

                // Split team data into variables
                const teamName = teamData.team_name;
                const teamMonsters = teamData.monsters;
                const teamStatRequirements = teamData.stat_requirement;
                const teamTurnOrder = teamData.turn_order;
                
                // Build base embed for team
                let helpEmbed = buildDungeonTeamEmbed(teamName, teamStatRequirements, teamTurnOrder);
                
                // Loop through each monster in team and add to embed
                for (let j = 0; j < teamMonsters.length; j++) {
                    // Get monster data from team monsters
                    const monsterData = teamMonsters[j];

                    // Split monster data into variables
                    const monsterName = monsterData.name;
                    const monsterLink = monsterData.link;
                    const monsterRuneSets = monsterData.rune_sets;
                    const monsterRunes = monsterData.runes;
                    const monsterMinStats = monsterData.min_stats;
                    
                    // Build stats field for monster
                    const statsField = buildMonsterStatsField(monsterRuneSets, monsterRunes, monsterMinStats);
                    
                    // Add monster field to embed
                    helpEmbed.addFields([
                        {
                            name: `${bold(monsterName)}`,
                            value: `[View ${monsterName} on SW Database](${monsterLink})
                            ${statsField}\n\u200B`,
                        },
                    ]);
                }
                // Finally add embed to embeds array, ready for sending
                embeds.push(helpEmbed);
            }
        }
        
        
        if (!args.length) {
            return message.author.send({ embeds })
            .then(() => {
                if (message.channel.type === ChannelType.DM) return;
                message.reply({ content: "I've sent you a DM with recommended Giants teams!" });
            })
            .catch((error) => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply({ content: "It seems like I can't DM you!" });
            });
        }


        // TODO - Implement arguments.
        // Code below does not currently do anything as it's not implemented.
        
        // If argument is provided, check if it's a command.
        
        /**
        * @type {String}
        * @description First argument in lower case
        */
        
        const name = args[0].toLowerCase();
        
        const command =
        commands.get(name) ||
        commands.find((c) => c.aliases && c.aliases.includes(name));
        
        // If it's an invalid command.
        
        if (!command) {
            return message.reply({ content: "That's not a valid command!" });
        }
        
        /**
        * @type {EmbedBuilder}
        * @description Embed of Help command for a specific command.
        */
        
        let commandEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Command Help");
        
        if (command.description)
        commandEmbed.setDescription(`${command.description}`);
        
        if (command.aliases)
        commandEmbed.addFields([
            {
                name: "Aliases",
                value: `\`${command.aliases.join(", ")}\``,
                inline: true,
            },
            {
                name: "Cooldown",
                value: `${command.cooldown || 3} second(s)`,
                inline: true,
            },
        ]);
        if (command.usage)
        commandEmbed.addFields([
            {
                name: "Usage",
                value: `\`${prefix}${command.name} ${command.usage}\``,
                inline: true,
            },
        ]);
        
        // Finally send the embed.
        
        message.channel.send({ embeds: [commandEmbed] });
    },
};

/**
 * Builds the stats field for a monster.
 * 
 * @param {*} runeSets 
 * @param {*} monsterRunes 
 * @param {*} minimumStats 
 * 
 * @returns an object containing a name and value for the field.
 */
function buildMonsterStatsField(runeSets, monsterRunes, minimumStats) {
    let stats = [];
    stats.push(`> **Sets:** ${runeSets}`);
    stats.push(`> **Main stats:** ${monsterRunes.map(rune => `${rune.main_stat}`).join(`/`)}`);
    stats.push("> ");
    stats.push(`> **Minimum stats:**`);
    stats.push(...minimumStats.map(minStat => `> ${minStat.stat}:\t${minStat.value}`));

    return stats.join("\n");
}

/**
 * Builds the embed for a dungeon team.
 * 
 * @param {*} teamName 
 * @param {*} statRequirements 
 * @param {*} turnOrder 
 * 
 * @returns an EmbedBuilder object.
 */
function buildDungeonTeamEmbed(teamName, statRequirements, turnOrder) {
    return new EmbedBuilder()
        .setColor("Aqua")
        .setTitle(`Giants team: ${teamName}`)
        .setDescription(`Recommended Giants teams for a ${teamName} team.`)
        .setThumbnail("https://static.wikia.nocookie.net/vsbattles/images/7/7c/Ancient_Giant_%28SW%29.png")
        .addFields([
            {
                name: "Stat requirements",
                value: `> *${statRequirements}*\n\u200B`,
            },
            {
                name: "Turn order",
                value: `> *${turnOrder}*\n\u200B`,
            }
        ]);
}

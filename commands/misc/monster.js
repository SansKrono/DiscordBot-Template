/**
 * @file Dynamic monster search command
 * @author Aaron Loz
 * @since 1.0.0
 * @version 1.0.0
 */

// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder, ChannelType, bold, italic } = require("discord.js");

// API module for SWARFARM calls
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * @type {import('../../typings').LegacyCommand}
 */
module.exports = {
    name: 'monster',
    description: 'Get Summoners War monster information including base stats, skills and recommended runes. Doesn\'t support generic family names *yet* (e.g. "Dragon" or "Ifrit")',
	aliases: ["monster, mon, unit"],
	usage: "[monster name]",
	cooldown: 5,

	async execute(message, args) {
        // Collection of embeds to send
        const embeds = [];

		// If there are no args, it means it needs whole help command.

        if (args.length) {
            try {
            const monsterName = args.join(' ');
            const response = await axios.get(`https://swarfarm.com/api/v2/monsters/?name=${monsterName}`);
            const monsterData = response.data.results[0]

            // If the monster doesn't exist, return an error message.
            if (!monsterData) {
                return message.reply(`Summon failed! I couldn't find a monster with the name ${monsterName}.`);
            }

            const skillIds = monsterData.skills.map(skill => skill);
            const skillData = [];

            for (const skillId of skillIds) {
                const skillResponse = await axios.get(`https://swarfarm.com/api/v2/skills/${skillId}`);
                skillData.push(skillResponse.data);
            }

            const familyName = monsterData.bestiary_slug
                .split('-')
                .slice(1, -1)
                .map(word => word
                    .charAt(0)
                    .toUpperCase() + word.slice(1))
                .join(' ');


            const runeRecommendations = await getRuneRecommendations(monsterData.name, familyName);


            const leaderSkill = monsterData.leader_skill;
            let leaderSkillText = 'None'
            leaderSkillText = leaderSkill ? 
                leaderSkill.area ? `${leaderSkill.amount}% ${leaderSkill.attribute} in ${leaderSkill.area} content` :
                leaderSkill.element ? `${leaderSkill.amount}% ${leaderSkill.attribute} for ${leaderSkill.element} monsters` :
                `${leaderSkill.amount}% ${leaderSkill.attribute} for all monsters` :
                'None';

            // Build max_lvl_hp, max_lvl_attack, max_lvl_defense, speed, crit_rate, crit_damage, resistance, accuracy into a formatted field
            const stats = [];
            stats.push(`> **HP:** ${monsterData.max_lvl_hp}`);
            stats.push(`> **Attack:** ${monsterData.max_lvl_attack}`);
            stats.push(`> **Defense:** ${monsterData.max_lvl_defense}`);
            stats.push(`> **Speed:** ${monsterData.speed}`);
            stats.push(`> **Crit Rate:** ${monsterData.crit_rate}`);
            stats.push(`> **Crit Damage:** ${monsterData.crit_damage}`);
            stats.push(`> **Resistance:** ${monsterData.resistance}`);
            stats.push(`> **Accuracy:** ${monsterData.accuracy}`);

            // Build stats into a discord embed field
            const statsField = {
                name: 'Max level Stats',
                value: stats.join('\n'),
                inline: true,
            };

            // Build sources array from monsterData.sources
            const sources = monsterData.source.map(source => `- ${source.name}`);

            const sourcesField = {
                name: 'Sources',
                value: (sources.length) ? sources.join('\n') : 'N/A',
                inline: true,
            };

            const runeRecommendationField = { 
                name: 'Rune Recommendations',
                value: runeRecommendations.map(recommendation => `- **${recommendation.content}**: ${recommendation.set} - ${recommendation.stats}`).join('\n'),
            };

            const embed = new EmbedBuilder()
                .setTitle(monsterData.name)
                .setDescription(familyName)
                .setThumbnail(`https://swarfarm.com/static/herders/images/monsters/${monsterData.image_filename}`)
                .addFields([
                    { 
                        name: '\u200B', 
                        value: `**Grade:** ${monsterData.natural_stars} Star
                                **Leader Skill:** ${italic(leaderSkillText)}
                                **Monster type:** ${monsterData.archetype}`,
                    },
                    statsField,
                    sourcesField,
                    {
                            name: `Skills:`,
                            value: skillData.map(skill => `- ${bold(skill.name)}: ${italic(skill.description)}`).join('\n'),
                    },
                    runeRecommendationField
                ])

            embeds.push(embed)

            return message.author.send({ embeds })
                .then(() => {
                    if (message.channel.type === ChannelType.DM) return;
                    message.reply({ content: `I've sent ${monsterData.name}'s info to your DMs!` });
                })
                .catch((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply({ content: "It seems like I can't DM you!" });
                });
            } catch (error) {
                console.error(error);
                message.reply('An error occurred while fetching monster data.');
            }
        }

        if (!args.length) {
            return message.reply('Please provide a monster name! (e.g. `!monster galleon`)');
        }
    },
};

async function getRuneRecommendations(monsterName, monsterFamily) {
    const formattedMonsterName = monsterName.toLowerCase().replace(/\s/g, '-');
    const formattedMonsterFamily = monsterFamily.toLowerCase().replace(/\s/g, '-');

    const url = `https://summonerswarskyarena.info/monster/${formattedMonsterName}-${formattedMonsterFamily}-review/`;

    try {
        let response;

        try {
            response = await axios.get(url);
        }
        catch (error) {
            response = await axios.get(`https://summonerswarskyarena.info/monster/${formattedMonsterName}-${formattedMonsterFamily}/`);
        }


        const $ = cheerio.load(response.data);
        const runeContainer = $('.rune-container');
        const runeList = runeContainer.find('.rune-list');
        const runeValues = runeContainer.find('.rune-values');


        // Take the matching indexes of runeList and runeValues and build an array of objects
        // runeValues[index]. children will return multiple strings so we need to combine them
        // also get the id value of the respective runeContainer
        // Remove any parenthesis and whitespace from the stats
        const runeRecommendations = runeList.map((index, element) => {
            return {
                content: $(runeContainer[index]).attr('id'),
                set: $(element).text(),
                stats: $(runeValues[index]).text()
                    .replace(/\(/g, '')
                    .replace(/\)/g, ''),
            }
        }).get();

        return runeRecommendations;


    } catch (error) {
        console.error(error);
    } 
}
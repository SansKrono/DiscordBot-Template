// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder, ChannelType } = require("discord.js");
const definitions = require('./data/stats.json');

module.exports = {
    name: 'explain',
    description: 'Explains a stat or mechanic. Where applicable, an example and result are provided.',
    aliases: ['define', 'definition', 'def'],
	usage: "[stat/mechanic]",
    cooldown: 5,

    execute(message, args) {
        const embeds = [];
        try {
            // Check if an argument is provided
            if (!args[0]) {
            return message.reply('Please provide a stat to explain.');
            }

            // combine all arguments into one string
            const argString = args.join(' ').toLowerCase();

            // get the stats array from the stats.json file
            const stats = definitions.stats;

            let matchingStat;

            // Each stat has an array of possible names. Find the stat that matches the input.
            for (const stat of stats) {
                if (stat.aliases.includes(argString)) {
                    matchingStat = stat;
                }
            }

            // If no stat is found, return an error message
            if (!matchingStat) {
                // Combine all stat names into an array
                const statNames = stats.map(stat => stat.name);
                // Combine all stat names into one string
                const statNamesString = statNames.join('\n- ');
                // Reply with an error message
                return message.reply(`I couldn't find a stat with the name **${argString}**. Here are all the stats I know:\n- ${statNamesString}\n\nYou can use either the full name or the abbreviation of the stat.`);
            }

            // extract the definition, example and result from the matching stat
            const { name, definition, example, result } = matchingStat;



            // Create an embed with the stat information
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(name)
                .setDescription(definition)

            if (example && result) {
                embed.addFields(
                    { name: 'Example', value: example },
                    { name: 'Result', value: result }
                );
            }

            embeds.push(embed);

            return message.author.send({ embeds })
                .then(() => {
                    if (message.channel.type === ChannelType.DM) return;
                    // React to the message with a letter emoji
                    message.react('📬');
                })
                .catch((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply({ content: "It seems like I can't DM you!" });
                });
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while getting definitions!');
        }
    },
};

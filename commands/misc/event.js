const { ActionRowBuilder,EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Generates event buttons.
 * @returns {ActionRowBuilder} The action row containing the event buttons.
 */
function generateEventButtons() {
    const acceptButton = new ButtonBuilder()
        .setCustomId(`acceptEvent`)
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success);

    const declineButton = new ButtonBuilder()
        .setCustomId(`declineEvent`)
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger);

    const maybeButton = new ButtonBuilder()
        .setCustomId(`maybeEvent`)
        .setLabel('Unsure')
        .setStyle(ButtonStyle.Primary);

    const editButton = new ButtonBuilder()
        .setCustomId(`editEventDate`)
        .setLabel('Edit Date 📅')
        .setStyle(ButtonStyle.Secondary);

    const cancelButton = new ButtonBuilder()
        .setCustomId(`cancelEvent`)
        .setLabel('Delete 🗑️')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(acceptButton, declineButton, maybeButton, editButton, cancelButton);
    return row;
}

/**
 * Generates an embed for an event.
 * 
 * @param {Object} options - The options for generating the event embed.
 * @param {string} options.eventName - The name of the event.
 * @param {string} options.eventDate - The date of the event.
 * @param {string[]} options.eventAttendees - The list of attendees for the event.
 * @param {string[]} options.eventDeclines - The list of attendees who declined the event.
 * @param {string[]} options.eventMaybes - The list of attendees who are unsure about the event.
 * @param {string} options.author - The author of the event.
 * @returns {EmbedBuilder} - The generated event embed.
 */
function generateEventEmbed({eventName, eventDate, eventAttendees, eventDeclines, eventMaybes, author}) {
    const attendingUsers = (eventAttendees?.length) ? eventAttendees.join('\n') : '';
    const decliningUsers = (eventDeclines?.length) ? eventDeclines.join('\n') : '';
    const maybeUsers = (eventMaybes?.length) ? eventMaybes.join('\n') : '';
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor(author)
        .setTitle(eventName)
        .addFields(
            { name: 'Date', value: `${eventDate}` || '-' },
            { name: 'Accepted ✅', value: `${attendingUsers}` || '-' },
            { name: 'Declined ❌', value: `${decliningUsers}` || '-' },
            { name: 'Unsure ❔', value: `${maybeUsers}` || '-' }
        );
}

module.exports = {
    name: "event",
    description: "[Deprecated] Currently being replaced with slash commands.",
    aliases: ["events", "invite"],
    usage: "",
    cooldown: 5,
    /**
     * Executes the event command.
     * 
     * @param {Message} message - The message object.
     */
    execute(message) {
        message.reply({
            content: "This command is currently being replaced with slash commands. If you have the permissions, please use `/event` instead.",
            ephemeral: true,
        });
    },
    generateEventButtons,
    generateEventEmbed
};



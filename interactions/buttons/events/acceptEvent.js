/**
 * Accepts an event and updates the event attendance.
 * @param {Object} interaction - The interaction object.
 * @returns {Promise<void>}
 */
const { generateEventEmbed, generateEventButtons } = require('../../../commands/misc/event');

module.exports = {
	id: "acceptEvent",
  
  async execute(interaction) {
    // Get the embed attacted to the interaction
    const eventEmbed = interaction.message.embeds[0];
    const eventName = eventEmbed.title;
    const eventDate = eventEmbed.fields[0].value;
    const eventAttendees = eventEmbed.fields[1].value
    const eventDeclines = eventEmbed.fields[2].value;
    const eventMaybes = eventEmbed.fields[3].value;
    const author = eventEmbed.author;

    let nickname = interaction.user.displayName;

    // If the embed is in a guild channel, find the users guild nickname
    if (interaction.guild) {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      nickname = member.nickname || interaction.user.displayName;
    }

    let eventDeclinesArray = (eventDeclines === '-') ? [] : eventDeclines.split('\n');
    let eventMaybesArray = (eventMaybes === '-') ? [] : eventMaybes.split('\n');
    let eventAttendeesArray = (eventAttendees === '-') ? [nickname] : eventAttendees.split('\n');

    // If the user is already in the list of declines, remove them
    const declineIndex = eventDeclinesArray.indexOf(nickname);
    if (declineIndex > -1) {
        await eventDeclinesArray.splice(declineIndex, 1);
    }

    // If the user is already in the list of maybes, remove them
    const maybeIndex = eventMaybesArray.indexOf(nickname);
    if (maybeIndex > -1) {
        await eventMaybesArray.splice(maybeIndex, 1);
    }

    // If the user isn't already in the list of attendees, add them
    const attendeeIndex = eventAttendeesArray.indexOf(nickname);
    if (attendeeIndex === -1) {
        await eventAttendeesArray.push(nickname);
    }
    
    const editedContent = {
      embeds: [generateEventEmbed({
        eventName, eventDate, 
        eventAttendees: eventAttendeesArray, 
        eventDeclines: eventDeclinesArray, 
        eventMaybes: eventMaybesArray,
        author,
      })],
      components: [generateEventButtons()]
    }
    
    // Edit the message with the updated embed
    await interaction.update(editedContent);
    return;
  },
};

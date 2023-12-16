/**
 * Executes the "declineEvent" interaction.
 * Removes the user from the list of event attendees and adds them to the list of event declines.
 * Updates the event message with the modified embed and buttons.
 *
 * @param {Interaction} interaction - The interaction object representing the user interaction.
 * @returns {Promise<void>} - A promise that resolves once the interaction is updated.
 */
const { generateEventEmbed, generateEventButtons } = require('../../../commands/misc/event');

module.exports = {
	id: "declineEvent",
  
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

    let eventAttendeesArray = (eventAttendees === '-') ? [] : eventAttendees.split('\n');
    let eventMaybesArray = (eventMaybes === '-') ? [] : eventMaybes.split('\n');
    let eventDeclinesArray = (eventDeclines === '-') ? [nickname] : eventDeclines.split('\n');

    // If the user is already in the list of attendees, remove them
    const attendeeIndex = eventAttendeesArray.indexOf(nickname);
    if (attendeeIndex > -1) {
        await eventAttendeesArray.splice(attendeeIndex, 1);
    }

    // If the user is already in the list of maybes, remove them
    const maybeIndex = eventMaybesArray.indexOf(nickname);
    if (maybeIndex > -1) {
        await eventMaybesArray.splice(maybeIndex, 1);
    }

    // If the user isn't already in the list of attendees, add them
    const declineIndex = eventDeclinesArray.indexOf(nickname);
    if (declineIndex === -1) {
        await eventDeclinesArray.push(nickname);
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

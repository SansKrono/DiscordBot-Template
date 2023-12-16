
// Import necessary Discord.js modules
const { generateEventEmbed, generateEventButtons } = require('../../../commands/misc/event');

// Define the command
module.exports = {
	id: "maybeEvent",
  
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
    let eventDeclinesArray = (eventDeclines === '-') ? [] : eventDeclines.split('\n');
    let eventMaybesArray = (eventMaybes === '-') ? [nickname] : eventMaybes.split('\n');

    // If the user is already in the list of attendees, remove them
    const attendeeIndex = eventAttendeesArray.indexOf(nickname);
    if (attendeeIndex > -1) {
        await eventAttendeesArray.splice(attendeeIndex, 1);
    }

    // If the user is already in the list of decliners, remove them
    const declineIndex = eventDeclinesArray.indexOf(nickname);
    if (declineIndex >= -1) {
        await eventDeclinesArray.splice(declineIndex, 1);
    }

    // If the user isn't already in the list of maybes, add them
    const maybeIndex = eventMaybesArray.indexOf(nickname);
    if (maybeIndex === -1) {
        await eventMaybesArray.push(nickname);
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

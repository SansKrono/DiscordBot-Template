const { generateEventEmbed, generateEventButtons } = require('../../../commands/misc/event');

// Define the command
module.exports = {
  id: "revertCancelEvent",
  async execute(interaction) {
    const eventEmbed = interaction.message.embeds[0];
    const eventName = eventEmbed.title;
    const eventDate = eventEmbed.fields[0].value;
    const eventAttendeesField = eventEmbed.fields[0].value
    const eventDeclinesField = eventEmbed.fields[1].value;
    const eventMaybesFIeld = eventEmbed.fields[2].value;
    const author = eventEmbed.author;

    let eventAttendees = (eventAttendeesField === '-') ? [] : eventAttendeesField.split('\n');
    let eventMaybes = (eventDeclinesField === '-') ? [] : eventDeclinesField.split('\n');
    let eventDeclines = (eventMaybesFIeld === '-') ? [] : eventMaybesFIeld.split('\n');

    const editedContent = {
      embeds: [generateEventEmbed({
        eventName, 
        eventDate, 
        eventAttendees,
        eventDeclines,
        eventMaybes,
        author,
      })],
      components: [generateEventButtons()]
    }
    // Edit the message with the updated embed
    await interaction.update(editedContent);
    return;
  }
};


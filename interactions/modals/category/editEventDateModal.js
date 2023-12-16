const { generateEventEmbed, generateEventButtons } = require('../../../commands/misc/event');

/**
 * @type {import('../../../typings').ModalInteractionCommand}
 */
module.exports = {
	id: "editEventDateDateModal",

	async execute(interaction) {
		// Get the message object of the interaction.
		const eventEmbed = interaction.message.embeds[0];
		const eventName = eventEmbed.title;
		const eventAttendeesField = eventEmbed.fields[1].value;
		const eventDeclinesField = eventEmbed.fields[2].value;
		const eventMaybesField = eventEmbed.fields[3].value;
		const author = eventEmbed.author;

		// get the text input from the modal
		const eventDateInput = interaction.fields.getTextInputValue('newDateInput');

		let eventAttendees = (eventAttendeesField === '-') ? [] : eventAttendeesField.split('\n');
		let eventMaybes = (eventDeclinesField === '-') ? [] : eventDeclinesField.split('\n');
		let eventDeclines = (eventMaybesField === '-') ? [] : eventMaybesField.split('\n');

		const editedContent = {
			embeds: [generateEventEmbed({
				eventName,
				eventDate: eventDateInput,
				eventAttendees,
				eventDeclines,
				eventMaybes,
				author,
			})],
			components: [generateEventButtons()]
		};

		// Edit the message with the updated embed
		await interaction.update(editedContent);
		return;
	},
};

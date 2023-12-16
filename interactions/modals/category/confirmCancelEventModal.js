/**
 * @type {import('../../../typings').ModalInteractionCommand}
 */
module.exports = {
	id: "confirmCancelEventModal",

	async execute(interaction) {
		// get the text input from the modal
		const deleteConfirmInput = interaction.fields.getTextInputValue('deleteConfirmInput');

		if (deleteConfirmInput.toUpperCase() !== 'DELETE') {
			await interaction.reply({ content: 'Your event was not deleted 👍', ephemeral: true });
			return;
		}

		// Edit the message with the updated embed
		await interaction.reply({ content: 'Your event was deleted 🗑️', ephemeral: true });
		await interaction.message.delete();
		return;
	},
};

/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("event")
		.setDescription(
			"Creates an event for the server in the channel it was called in."
		)
		.addStringOption((option) =>
		option
			.setName("name")
			.setDescription("The name of the event")
		),


		async execute(interaction) {

			const modal = new ModalBuilder()
			.setCustomId('createNewEventModal')
			.setTitle('Create New Event');
	
			const eventNameInput = new TextInputBuilder()
			.setCustomId('eventNameInput')
			// The label is the prompt the user sees for this input
			.setLabel("Enter a name for the event")
			.setValue("")
			.setPlaceholder("e.g. Labyrinth Raid")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short)

			// Set the value of the input to the name option
			if (interaction.options.getString("name") !== null) {
				eventNameInput.setValue(interaction.options.getString("name"));
			}
	
			const eventDateInput = new TextInputBuilder()
			.setCustomId('eventDateInput')
			// The label is the prompt the user sees for this input
			.setLabel("Enter a date for the event")
			.setValue("")
			.setPlaceholder("e.g. Saturday 16th Dec @ 8pm PST")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short);
	
			const firstActionRow = new ActionRowBuilder().addComponents(eventNameInput);
			const secondActionRow = new ActionRowBuilder().addComponents(eventDateInput);
	
	
			modal.addComponents(firstActionRow, secondActionRow);
	
			await interaction.showModal(modal);
		},
};
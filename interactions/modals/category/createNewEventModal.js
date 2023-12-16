const { generateEventEmbed, generateEventButtons } = require('../../../commands/misc/event');
/**
* @type {import('../../../typings').ModalInteractionCommand}
*/
module.exports = {
	id: "createNewEventModal",
	
	async execute(interaction) {
		
		const eventName = interaction.fields.getTextInputValue('eventNameInput');
		const eventDate = interaction.fields.getTextInputValue('eventDateInput');

		
		// Get the username of the user who called the slash command
		let nickname = interaction.user.id
		if (interaction.guild) {
			const member = interaction.guild.members.fetch(interaction.user.id);
			nickname = member.nickname || interaction.user.displayName;
		}
		
		const url = interaction.user.avatarURL();
		
		
		const author = {
			name: `New event created by ${nickname}`,
			url,
		};

		const content = {
			embeds: [generateEventEmbed({ eventName, eventDate, author })],
			components: [generateEventButtons()]
		};
		
		// Send the embed to the channel
		interaction.channel.send(content);
		await interaction.deferUpdate();
	},
};

/**
 * Cancels an event.
 * @param {Interaction} interaction - The interaction object.
 * @returns {Promise<void>}
 */
const { ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');

module.exports = {
  id: "cancelEvent",
  
  async execute(interaction) {

    // Get the embed attacted to the interaction
    const embed = interaction.message.embeds[0];
    const author = embed.author;

    // Get the user who originally created the event
    const authorId = author.url.split('/')[4];
    const authorUser = await interaction.client.users.fetch(authorId);
    
    
    // If the author is not the embed author, return
    if (authorUser.id !== interaction.user.id) {
      console.log('interaction.message.author.id', interaction.message.author.id);
      console.log('interaction.user.id', interaction.user.id);
      // Silently tell the user that they can't cancel the event
      await interaction.reply({ content: 'Only the event author can cancel the event.', ephemeral: true });
      return;
    }

    // Create a modal asking if the user wants to cancel the event
    const modal = new ModalBuilder()
    .setCustomId('confirmCancelEventModal')
    .setTitle('Cancel Event');    

    const deleteConfrimInput = new TextInputBuilder()
    .setCustomId('deleteConfirmInput')
      // The label is the prompt the user sees for this input
    .setLabel("Type 'delete' to delete the event")
      // Short means only a single line of text
    .setStyle(TextInputStyle.Short);

    const row = new ActionRowBuilder()
    .addComponents(deleteConfrimInput);

    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};


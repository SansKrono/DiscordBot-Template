/**
 * @file editEventDate.js
 * @description This file contains the implementation of the "editEventDate" command, which allows the author of an event to edit its date.
 * @requires discord.js
 */
const { TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder} = require('discord.js');

module.exports = {
  /**
   * The unique identifier of the "editEventDate" command.
   * @type {string}
   */
  id: "editEventDate",
  
  /**
   * Executes the "editEventDate" command.
   * @param {Interaction} interaction - The interaction object representing the command invocation.
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    // Get the embed attached to the interaction
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
      await interaction.reply({ content: 'Only the event author can edit the event.', ephemeral: true });
      return;
    }

    const modal = new ModalBuilder()
    .setCustomId('editEventDateDateModal')
    .setTitle('Edit Event Date');

    const newDateInput = new TextInputBuilder()
    .setCustomId('newDateInput')
      // The label is the prompt the user sees for this input
    .setLabel("Enter a new date for the event")
      // Short means only a single line of text
    .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(newDateInput);


    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },
};

const { Command } = require('../structure')
const { MessageEmbed } = require('discord.js')

module.exports = class NotifyCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'notify',
      category: 'Utilitários',
      aliases: ['notificar'],
      description: 'Recebe ou remove o cargo de notificações.'
    })
  }

  run ({ channel, member, config }) {
    const embed = new MessageEmbed().setColor(config.color)
    if (member.roles.cache.has(config.roles.notify)) {
      member.roles.remove(config.roles.notify)
      embed.setDescription('Agora você **não** será notificado quando houver notícias')
    } else {
      embed.setDescription('Agora você **sempre** será notificado quando houver notícias.')
      member.roles.add(config.roles.notify)
    }

    channel.send(embed)
  }
}

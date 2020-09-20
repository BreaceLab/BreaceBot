const { Command } = require('../structure')
const { MessageEmbed } = require('discord.js')

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      category: 'Informações',
      aliases: ['pong', 'pingpong']
    })
  }

  run ({ channel, config }) {
    const embed = new MessageEmbed().setColor(config.defaultColor)
    embed.setDescription(`<a:breace_animated:753454923231920242> \`${this.client.ws.ping}ms\``)
    channel.send(embed)
  }
}

const { Command } = require('../structure')

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      category: 'Informações',
      aliases: ['pong', 'pingpong']
    })
  }

  run ({ channel }) {
    const embed = this.embed()
    embed.setDescription(`<a:breace_animated:753454923231920242> \`${this.client.ws.ping}ms\``)
    channel.send(embed)
  }
}

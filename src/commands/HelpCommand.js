const { Command } = require('../structure')

module.exports = class HelpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      category: 'Utilitários',
      aliases: ['ajuda'],
      description: 'Mostra uma lista com os comandos.'
    })
  }

  run ({ channel, guild, config }) {
    const embed = this.embed()
    embed
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(`[**GitHub**](https://github.com/breacelab/breacebot) | Prefixos disponíveis: ${config.prefixes.map(prefix => `\`${prefix}\``).join('**, **')}`)

    const filter = this.client.commands.array().filter(c => !c.devOnly && !c.staffOnly)

    filter
      .map(c => c.category)
      .filter((value, index, array) => array.indexOf(value) === index)
      .map(category => {
        embed.addField(category, filter.filter(c => c.category === category).map(c => `\`${c.name}\``).join('** - **'))
      })

    channel.send(embed)
  }
}

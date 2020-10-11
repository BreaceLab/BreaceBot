const { Command } = require('../structure')

module.exports = class LogCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'log',
      category: 'Staffs',
      staffOnly: true,
      description: 'Faz um log no grupo.',
      usage: 'log <avisos> <imagem> <conteúdo>'
    })
  }

  run ({ channel, args: [type, image, ...content], config, prefix, context }) {
    const embed = this.embed()
    if (!type || !image) {
      embed.setDescription([
        'Modo correto de uso:',
        '```',
        `${prefix}${this.usage}`,
        '```'
      ])

      return channel.send(embed)
    }

    switch (type.toLowerCase()) {
      case 'avisos':
      case 'aviso':
        embed.setImage(image)
        embed.setDescription(content.join(' '))

        this.makeLog(config.channels.announces, context, embed)
        break
    }
  }

  makeLog (channelID, message, embed) {
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    const channelToSend = message.client.channels.cache.get(channelID)
    channelToSend.send(embed)
      .then(() => {
        message.channel.send(`Anúncio feito no canal: ${channelToSend}`)
        message.delete()
      })
  }
}

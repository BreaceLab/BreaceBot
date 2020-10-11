const { Listener } = require('../structure/')
const { MessageEmbed, Util } = require('discord.js')

module.exports = class MessageReactionAddListener extends Listener {
  constructor () {
    super({
      name: 'messageReactionAdd'
    })
  }

  run (reaction, user) {
    if (user.id === this.user.id || !reaction || !this.config.reactions.suggestions.includes(reaction.emoji.id)) return
    if (reaction.count >= 6) {
      if (reaction.emoji.id === this.config.reactions.suggestions[0]) {
        const embed = new MessageEmbed().setColor(this.config.color)
        const acceptedChannel = this.channels.cache.get(this.config.channels.acceptedSuggestions)

        embed.setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL({ dynamic: true }))
        embed.setDescription([
        `**Sugestão aceita:** \`${Util.escapeMarkdown(reaction.message.content)}\``, '',
        reaction.message.reactions.cache.filter(r => this.config.reactions.suggestions.includes(r._emoji.id)).map(r => `${r._emoji} \`${r.count}\``).join(' | ')
        ])

        if (acceptedChannel) acceptedChannel.send(embed).then(() => reaction.message.delete())
      } else {
        reaction.message.delete()
      }
    }
  }
}

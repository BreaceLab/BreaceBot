const { Listener } = require('../structure/')

module.exports = class RawListener extends Listener {
  constructor () {
    super({
      name: 'raw'
    })
  }

  async run (packet) {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return
    const channel = this.channels.cache.get(packet.d.channel_id)
    const user = await this.users.fetch(packet.d.user_id)

    if (user && (this.config.channels.suggestions.includes(channel.id) || this.config.channels.rolesChannel === channel.id)) {
      if (channel.messages.cache.has(packet.d.message_id)) return

      channel.messages.fetch(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name
        const reaction = message.reactions.cache.get(emoji)
        if (reaction) reaction.users.set(packet.d.user_id, user)
        if (packet.t === 'MESSAGE_REACTION_ADD') {
          this.emit('messageReactionAdd', reaction, user)
        }
      })
    }
  }
}

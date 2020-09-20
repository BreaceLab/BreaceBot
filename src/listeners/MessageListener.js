const { Listener, CommandContext } = require('../structure')

module.exports = class MessageListener extends Listener {
  constructor () {
    super({
      name: 'message'
    })
  }

  async run (message) {
    if (message.author.bot || message.channel.type !== 'text' || !message.startsWithPrefix()) return

    await message.giveXp()

    const prefix = message.getPrefixOfContent()
    const args = message.arguments(prefix)
    const cmd = args.shift().toLowerCase()
    const command = this.commands.find(({ name, aliases }) => name === cmd || aliases.includes(cmd))

    const context = new CommandContext(message, args, cmd, prefix)

    if (command && message.allowedChannels.includes(message.channel.id)) command.preLoad(context)
  }
}

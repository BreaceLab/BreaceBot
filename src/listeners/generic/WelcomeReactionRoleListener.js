const { Listener } = require('../../structure')

module.exports = class WelcomeReactionRoleListener extends Listener {
  constructor () {
    super({
      name: 'messageReactionAdd',
      generic: true
    })
  }

  async run (reaction, user) {
    if (!reaction || !user) return
    if (reaction.message.channel.id !== this.config.channels.rolesChannel) return
    const guild = reaction.message.guild
    const guildMember = await guild.members.fetch(user.id)
    const reactionRole = this.config.reactions.reactionRole
    const name = reaction.emoji.name
    let role = reactionRole.dev[name]
    if (role) {
      const dev = this.config.roles.developer
      if (!guildMember.roles.cache.has(dev)) {
        await guildMember.roles.add(dev, 'Reaction Dev Role')
      }
    } else {
      role = reactionRole.others[name]
    }
    if (role) await guildMember.roles.add(role, 'Reaction Role')
  }
}

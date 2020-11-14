const { Listener } = require('../../structure')

module.exports = class WelcomeReactionRoleListener extends Listener {
  constructor () {
    super({
      name: 'messageReactionRemove',
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
    const isDev = !!role
    if (!role) {
      role = reactionRole.others[name]
    }

    if (role) await guildMember.roles.remove(role, 'Reaction Role')
    if (isDev) {
      const allDev = Object.values(reactionRole.dev)
      const dev = guildMember.roles.cache.some(({ id }) => allDev.includes(id))
      if (!dev) {
        await guildMember.roles.remove(this.config.roles.developer, 'Reaction Dev Role')
      }
    }
  }
}

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
    const guild = await this.guilds.cache.get(this.config.guild)
    const guildMember = await guild.member(user.id)
    const reactionRole = this.config.reactions.reactionRole
    const get = guild.roles.cache.get
    const name = reaction.emoji.name
    let role = reactionRole.dev[name]
    const isDev = !!role
    if (!role) {
      role = reactionRole.others[name]
    }

    if (role) await guildMember.roles.remove(role, 'Reaction Role')
    if (isDev) {
      const dev = Object.values(this.config.roles.dev).some(guildMember.roles.cache.has)
      if (!dev) {
        await guildMember.remove(await get(dev), 'Reaction Dev Role')
      }
    }
  }
}

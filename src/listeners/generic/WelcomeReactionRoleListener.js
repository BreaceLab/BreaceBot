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
    const guild = await this.guilds.cache.get(this.config.guild)
    const guildMember = await guild.member(user.id)
    const reactionRole = this.config.reactions.reactionRole
    const get = guild.roles.cache.get
    const name = reaction.emoji.name
    let role = reactionRole.dev[name]
    if (role) {
      const dev = this.config.roles.dev
      if (!guildMember.roles.cache.has(dev)) {
        await guildMember.add(await get(dev), 'Reaction Dev Role')
      }
    } else {
      role = reactionRole.others[name]
    }

    if (role) await guildMember.roles.add(role, 'Reaction Role')
  }
}

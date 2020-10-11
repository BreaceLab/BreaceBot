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
    if (reaction.message.id !== this.config.messages.welcomeRoles) return

    const guild = await this.guilds.cache.get(this.config.guild)
    const guildMember = await guild.member(user.id)

    const langRole = await guild.roles.cache
      .find(r => {
        return r.id === this.config.reactions.reactionRole.languages[reaction.emoji.name]
      })

    const otherRole = await guild.roles.cache
      .find(r => {
        return r.id === this.config.reactions.reactionRole.others[reaction.emoji.name]
      })

    if (otherRole) await guildMember.roles.remove(otherRole, 'Reaction Role')
    if (langRole) await guildMember.roles.remove([langRole, '736257239483940945'], 'Reaction Role')
  }
}

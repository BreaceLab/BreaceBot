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
    if (reaction.message.id === this.config.messages.welcomeRoles || reaction.message.id === this.config.messages.otherMessages) {
      const guild = await this.guilds.cache.get(this.config.guild)
      const guildMember = await guild.member(user.id)

      const role = await guild.roles.cache
        .find(r => r.id === this.config.recations.reactionRole[reaction.emoji.name])

      if (role) await guildMember.roles.remove(role, 'Reaction Role')
    }
  }
}

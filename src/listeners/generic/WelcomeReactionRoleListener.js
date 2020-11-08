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
    if (reaction.message.id === this.config.messages.welcomeRoles || reaction.message.id === this.config.messages.otherMessages) {
      const guild = await this.guilds.cache.get(this.config.guild)
      const guildMember = await guild.member(user.id)

      const langRole = await guild.roles.cache
        .find(r => {
          return r.id === this.config.reactions.reactionRole.languages[reaction.emoji.name]
        })

      const markingRole = await guild.roles.cache
        .find(r => {
          return r.id === this.config.reactions.reactionRole.marking[reaction.emoji.name]
        })

      const otherRole = await guild.roles.cache
        .find(r => {
          return r.id === this.config.reactions.reactionRole.others[reaction.emoji.name]
        })

      if (langRole) await guildMember.roles.add([langRole, this.config.roles.developer], 'Reaction Role')
      if (markingRole) await guildMember.roles.add([markingRole, this.config.roles.developer], 'Reaction Role')
      if (otherRole) await guildMember.roles.add(otherRole, 'Reaction Role')
    }
  }
}

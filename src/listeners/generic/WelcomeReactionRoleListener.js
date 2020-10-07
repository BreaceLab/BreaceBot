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
    if (reaction.message.id !== this.config.messages.welcomeRoles) return

    const guild = await this.guilds.cache.get(this.config.guild)
    const guildMember = await guild.member(user.id)

    const role = await guild.roles.cache
      .find(r => {
        return r.id === this.config.reactions.reactionRole[reaction.emoji.name]
      })

    if (!role) return

    await guildMember.roles.add(role, 'Reaction Role')
  }
}

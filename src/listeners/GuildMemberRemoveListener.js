const { Listener } = require('../structure')
const { MessageEmbed } = require('discord.js')

module.exports = class MessageListener extends Listener {
  constructor () {
    super({
      name: 'guildMemberRemove'
    })
  }

  run (member) {
    const embed = new MessageEmbed()
      .setColor(this.config.color)
      .setDescription([
        `O usuário \`${member.user.tag} (${member.id})\` saiu do servidor...`
      ])
      .setFooter(`Agora possuímos ${member.guild.memberCount} membros!`, member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()

    if (member.guild.id === this.config.guild) {
      const leaveChannel = this.channels.cache.get(this.config.channels.leave)

      if (leaveChannel) leaveChannel.send(embed)
    }
  }
}

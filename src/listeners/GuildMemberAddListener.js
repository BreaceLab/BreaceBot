const { Listener } = require('../structure')
const { MessageEmbed } = require('discord.js')

module.exports = class MessageListener extends Listener {
  constructor () {
    super({
      name: 'guildMemberAdd'
    })
  }

  run (member) {
    const embed = new MessageEmbed()
      .setColor(this.config.color)
      .setTitle(`👋 Bem-vindo(a)┆${member.user.tag}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription([
        '🧪┆BreaceLab', '',
        'seja bem vindo a BreaceLab, aqui é uma comunidade de desenvolvedores de jogos, onde você pode aprender programação e muito mais.', '',
        '📦┆Pegue cargos no canal <#732058839104487464>', '', '🚫┆leia as <#723538550188146791> e evite ser punido.', '',
        '❓┆para saber mais sobre o servidor vá em <#723728707356721157>'
      ])
      .setAuthor(`${member.user.username}`, `${member.user.displayAvatarURL}`)
      .setTimestamp()

    if (member.guild.id === this.config.botGuild) {
      const welcomeChannel = this.channels.cache.get(this.config.welcome)

      if (welcomeChannel) welcomeChannel.send(embed)
      if (!member.user.bot) member.roles.add(this.config.roles.newUser)
    }
  }
}

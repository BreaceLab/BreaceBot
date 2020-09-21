const { Command } = require('../structure')
const { MessageEmbed } = require('discord.js')

module.exports = class LevelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'level',
      category: 'Sociais',
      aliases: ['nivel'],
      description: 'Mostra informações do seu nível atual.'
    })
  }

  async run ({ channel, author, mentions: { users }, config, context }) {
    const embed = new MessageEmbed().setColor(config.color)
    const target = users.size ? users.first() : author
    const data = await this.client.database.models.users.findById(target.id)

    const features = Object.entries(context.levelFeatures)

    embed.setDescription([
      `• **Usuário:** \`${target.tag}\``,
      `• **Level/Xp:** \`${data.level} (${data.xp}/${data.level ** 5 + (100 * (data.level * 2))})\``, '',
      `• **Interaja para liberar os benefícios:**\n${features.filter(([level]) => data.level < level).map(([level, { reward }]) => `-  *\`[${level}]. ${reward}\`*`).join('\n')}`
    ])
    embed.setThumbnail(target.displayAvatarURL({ dynamic: true }))

    channel.send(embed)
  }
}
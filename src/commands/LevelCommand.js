const { Command } = require('../structure')

module.exports = class LevelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'level',
      category: 'Sociais',
      aliases: ['nivel'],
      description: 'Mostra informações do seu nível atual.'
    })
  }

  async run ({ channel, author, mentions: { users }, context }) {
    const embed = this.embed()
    const target = users.size ? users.first() : author
    const data = await this.client.database.models.users.findById(target.id)

    const features = Object.entries(context.levelFeatures).filter(([level]) => data.level < level)
    const rank = await this.client.database.models.users.find().sort({ level: -1 }).sort({ xp: -1 })
    const position = rank.indexOf(rank.find(({ _id }) => _id === data._id))

    const description = [
      `• **Usuário:** \`${target.tag}\``,
      `• **Level:** \`${data.level} (${data.xp}/${data.level ** 5 + (100 * (data.level * 2))} Xp)\``,
      `• **Rank:** \`#${position + 1}\``
    ]

    if (features.length) description.push('', `• **Interaja para liberar os benefícios:**\n${features.map(([level, { reward }]) => `-  *\`[${level}]. ${reward}\`*`).join('\n')}`)

    embed.setDescription(description)
    embed.setThumbnail(target.displayAvatarURL({ dynamic: true }))

    channel.send(embed)
  }
}

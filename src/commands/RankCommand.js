const { Command } = require('../structure')

module.exports = class RankCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rank',
      category: 'Sociais',
      aliases: ['leaderboard'],
      description: 'Mostra informações do seu nível atual.'
    })
  }

  async run ({ channel, guild }) {
    channel.startTyping()
    const embed = this.embed()

    const rank = await this.getRank()

    embed
      .setTitle('Rank')
      .setDescription(rank)
      .setThumbnail(guild.iconURL({ dynamic: true }))

    channel
      .send(embed)
      .then(() => {
        channel.stopTyping()
      })
  }

  async getRank () {
    const array = []
    const users = await this.client.database.getRank('users', 10)

    users.map(async (dbUser, position) => {
      const user = await this.client.users.fetch(dbUser._id)

      array.push(`[${String(position + 1).padStart(2, '0')}] - **${user.tag}**\n*Level: ${dbUser.level} \`(${dbUser.xp}/${dbUser.level ** 5 + (100 * (dbUser.level * 2))} Xp)\`*`)
    })

    return array
  }
}

const { Command } = require('../structure')

module.exports = class BoostersCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'boosters',
      category: 'Utilitários',
      aliases: ['nitroboosters'],
      description: 'Mostra quantos Nitro Boosters há no servidor.'
    })
  }

  run ({ channel, guild }) {
    const embed = this.embed()
    const boosters = guild.members.cache.filter(member => member.premiumSince)

    embed.setTitle(`<a:breace_animated:753454923231920242> BreaceLab (Boosters: ${boosters.size})`)
    embed.setDescription([
      `Quantidade atual de boosts no servidor \`${guild.premiumSubscriptionCount}\` <:boost:724566423220781097>`, '',
      '```html',
      ...boosters.map(member => `<-> ${member.user.tag};`),
      '```'
    ])

    channel.send(embed)
  }
}

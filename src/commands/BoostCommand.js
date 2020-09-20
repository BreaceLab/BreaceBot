const { Command } = require('../structure')
const { MessageEmbed } = require('discord.js')

module.exports = class BoostCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'boost',
      category: 'Utilitário',
      aliases: ['nitroboost'],
      description: 'Mostra quantos Nitro Boosters há no servidor.'
    })
  }

  run ({ channel, guild, config }) {
    const embed = new MessageEmbed().setColor(config.defaultColor)
    embed.setTitle(`<a:breace_animated:753454923231920242> BreaceLab (Nível: ${guild.premiumTier})`)
    embed.setDescription([
      `Quantidade atual de boosters no servidor \`${guild.premiumSubscriptionCount}\` <:boost:724566423220781097>`, '',
      'Recompensas que você pode ganhar assim que der boost, se você der boost achando que esta livre das regras, esta completamente enganado.', '',
      'Recompensas listadas abaixo:', '```html',
      '<-> Enviar links e imagens em qualquer canal de conversa;', '',
      '<-> Pode alterar ou colocar apelido;', '',
      '<-> Em eventos, você poderá ter chance de ser um dos jurados;', '',
      '<-> Poderá divulgar seu jogo, canal, live e etc, no canal #🗞┆divulgação', '',
      '<-> Eventos especiais só para boosters;', '',
      '<-> XP do bot @BreaceLab#5819 em dobro.', '```'
    ])
    channel.send(embed)
  }
}

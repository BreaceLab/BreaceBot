const { MessageEmbed } = require('discord.js')

module.exports = class Command {
  constructor (client, options) {
    this.client = client

    this.name = options.name
    this.aliases = options.aliases || []
    this.description = options.description || 'Comando sem descrição.'
    this.usage = options.usage || 'Comando sem modo de uso.'
    this.category = options.category || 'Geral'
    this.devOnly = options.devOnly || false
    this.staffOnly = options.staffOnly || false
  }

  preLoad (ctx) {
    const embed = new MessageEmbed().setColor(ctx.config.color)

    if (this.devOnly && !this.client.config.owners.includes(ctx.author.id)) {
      embed.setDescription('Este comando se encontra disponível apenas para meus donos.')
      return ctx.channel.send(embed)
    }

    if (this.staffOnly && !ctx.member.roles.cache.has(ctx.config.roles.staff)) {
      embed.setDescription(`Apenas membros com o cargo ${this.client.guilds.cache.get(ctx.config.guild).roles.cache.get(ctx.config.roles.staff)} podem usar esse comando.`)
      return ctx.channel.send(embed)
    }

    try {
      this.run(ctx)
    } catch (error) {
      embed.setDescription(`Erro:\`\`\`${error.message || error}\`\`\``)

      ctx.channel.send(embed)
    }
  }

  run () {}
}

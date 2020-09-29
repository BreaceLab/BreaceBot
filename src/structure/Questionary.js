const { MessageEmbed } = require('discord.js')
const { EventEmitter } = require('events')

module.exports = class Questionary extends EventEmitter {
  constructor (context, options = {}) {
    super()

    this.context = context
    this.answers = []
    this.file = options.file

    this.ended = false
  }

  get questions () {
    return require(`../assets/questions/${this.file}.json`)
  }

  async create () {
    const embed = this.embed()
    const dmMessage = await this.safeDM()

    if (dmMessage) {
      for (var index = 0; index < this.questions.length; index++) {
        const { question } = this.questions[index]
        embed.setDescription(`**Pergunta ${index + 1}:** \`${question}\``)
        dmMessage.edit(embed)

        const filter = (m) => m.author.id === this.context.author.id
        const options = { max: 1, time: 60000, errors: ['time'] }

        const collector = await dmMessage.channel.awaitMessages(filter, options)
        this.answers.push(collector.first().content)
      }

      this.end(dmMessage)
    }
  }

  end (dmMessage) {
    const embed = this.embed()
    embed.setDescription('Obrigado por fazer o formulário!')
    dmMessage.edit(embed)

    this.ended = true
    this.emit('end')
  }

  async safeDM (content = `Olá \`${this.context.author.tag}\`, já vamos começar seu formulário!`) {
    const embed = this.embed()
    return this.context.author.send(content)
      .then(DMMessage => {
        this.context.channel.send(embed.setDescription(`${this.context.author}, este [link](${DMMessage.url}) te levará direto para o formulário!`))
        return DMMessage
      })
      .catch(_ => {
        const embed = this.embed()
        embed.setDescription(`${this.context.author}, suas **mensagens diretas (DM)** estão fechadas! Abra elas e use o comando novamente!`)

        this.context.channel.send(embed)
        return null
      })
  }

  embed (color = this.context.config.color) {
    const embed = new MessageEmbed()
    embed.setColor(color)
    embed.setFooter(`Feito por ${this.context.config.owners.map(o => this.context.client.users.cache.get(o).tag).join(', ')} © ${new Date().getFullYear()}`, this.context.client.user.displayAvatarURL({ format: 'png' }))

    return embed
  }
}

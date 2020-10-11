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
    const dmChannel = await this.safeDM()

    if (dmChannel) {
      for (var index = 0; index < this.questions.length; index++) {
        const { question } = this.questions[index]
        embed.setDescription(`**Pergunta ${index + 1}:** \`${question}\``)
        await dmChannel.send(embed)

        const filter = (m) => m.author.id === this.context.author.id
        const options = { max: 1, time: 60000, errors: ['time'] }

        const collector = await dmChannel.awaitMessages(filter, options)

        if (['cancel', 'cancelar'].includes(collector.first().content)) {
          return this.emit('stopped')
        }

        this.answers.push(collector.first().content)
      }

      this.end(dmChannel)
    }
  }

  end (dmChannel) {
    const embed = this.embed()
    embed.setDescription('Obrigado por fazer o formulário!')
    dmChannel.send(embed)

    this.ended = true
    this.emit('end')
  }

  async safeDM (content = `Olá \`${this.context.author.tag}\`, já vamos começar seu formulário!`) {
    const embed = this.embed()
    const dmChannel = this.context.author.dmChannel || await this.context.author.createDM()
    dmChannel.send(content)
      .then(DMMessage => {
        this.context.channel.send(embed.setDescription(`${this.context.author}, este [link](${DMMessage.url}) te levará direto para o formulário!`))
        return DMMessage.channel
      })
      .catch(_ => {
        const embed = this.embed()
        embed.setDescription(`${this.context.author}, suas **mensagens diretas (DM)** estão fechadas! Abra elas e use o comando novamente!`)

        this.context.channel.send(embed)
        return null
      })

    return dmChannel
  }

  embed (color = this.context.config.color) {
    const embed = new MessageEmbed()
    embed.setColor(color)
    embed.setFooter(`Feito por ${this.context.config.owners.map(o => this.context.client.users.cache.get(o).tag).join(', ')} © ${new Date().getFullYear()}`, this.context.client.user.displayAvatarURL({ format: 'png' }))

    return embed
  }
}

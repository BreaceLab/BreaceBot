const { Command, Questionary } = require('../structure')

module.exports = class FormCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'form',
      category: 'Utilitários',
      aliases: ['formulário'],
      description: 'Realiza o formulário para entrar na equipe.'
    })
  }

  async run (context) {
    const formQuestionary = new Questionary(context, { file: 'FormQuestions' })
    const botGuild = this.client.guilds.cache.get(context.config.guild)
    const formsChannel = botGuild.channels.cache.get(context.config.channels.forms)

    formQuestionary.on('stopped', async () => {
      const embed = this.embed()
        .setColor('FF0000')
        .setDescription('Seu formulário foi cancelado.')

      await context.author.send(embed)
    })

    formQuestionary.on('end', () => this.handleForm(formQuestionary))

    if (formsChannel) await formsChannel.send(`\`${context.author.tag}\` iniciou um formulário...`)
    await formQuestionary.create()
  }

  handleForm (form) {
    const embed = this.embed()
    const botGuild = this.client.guilds.cache.get(form.context.config.guild)
    const formsChannel = botGuild.channels.cache.get(form.context.config.channels.forms)
    form.questions.map(({ question }, index) => {
      embed.addField(question, form.answers[index])
    })

    embed.setAuthor(`Formulário de: ${form.context.author.tag}`, form.context.author.displayAvatarURL({ dynamic: true }))

    if (formsChannel) formsChannel.send(embed)
  }
}

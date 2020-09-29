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

    formQuestionary.on('end', () => this.handleForm(formQuestionary))

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

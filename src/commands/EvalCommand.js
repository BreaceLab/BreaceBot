/* eslint-disable no-eval */
const { Command } = require('../structure')

module.exports = class EvalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'eval',
      devOnly: true
    })
  }

  async run (ctx) {
    var string = ctx.args.join(' ')
    if (string.startsWith('`') && string.endsWith('`')) {
      string = string.substr(3, string.length)
      string = string.substr(0, string.length - 3)
      string = string.substr(2, string.length)
    }
    try {
      let evaled = await eval(string)
      if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled, { depth: 0, showHidden: false }) }
      ctx.channel.send(this.clean(evaled), { code: 'js' })
    } catch (err) {
      ctx.channel.send(`\`ERROR\` \`\`\`js\n${this.clean(err)}\n\`\`\``)
    }
  }

  /* async run (ctx) {
    ctx.guild.channels.cache.get('732058839104487464').messages.fetch('765347337023258634').then(msg => {
      ['🎨', '👾', '🐼', '🎙️'].map(reaction => msg.react(reaction))
    })
  } */

  clean (text) {
    return typeof (text) === 'string' ? text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) : text
  }
}

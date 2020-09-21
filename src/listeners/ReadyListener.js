const { Listener } = require('../structure/')

module.exports = class ReadyListener extends Listener {
  constructor () {
    super({
      name: 'ready',
      once: true
    })
  }

  run () {
    this.user.setActivity(this.config.prefixes.map(prefix => `${prefix}help`).join(' | '), { type: 'PLAYING' })
    console.log(this.user.username, 'is ready to use.')
  }
}

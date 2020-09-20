const { Listener } = require('../structure/')

module.exports = class ReadyListener extends Listener {
  constructor () {
    super({
      name: 'ready',
      once: true
    })
  }

  run () {
    this.user.setActivity('>help', { type: 'PLAYING' })
    console.log(this.user.username, 'is ready to use.')
  }
}

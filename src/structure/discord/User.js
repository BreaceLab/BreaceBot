const { Structures } = require('discord.js')

module.exports = Structures.extend('User', (DiscordUser) => {
  return class User extends DiscordUser {
    constructor (...opts) {
      super(...opts)

      this.leibe = 'Beibe Beibe do biruleibe leibe'
    }

    async data () {
      return this.client.database.getDocument(this.id, 'users')
    }
  }
})

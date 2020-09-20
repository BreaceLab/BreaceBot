const { Client, Collection } = require('discord.js')
const Loaders = require('./loader')

const Database = require('./database/Database')

require('./structure/discord')

module.exports = class Breace extends Client {
  constructor (options = {}) {
    super(options)
    this.token = options.token
    this.config = {
      owners: options.owners,
      prefixes: options.prefixes,
      defaultColor: options.defaultColor,
      botGuild: options.botGuild,
      database: options.database
    }

    this.database = new Database(this)
    this.commands = new Collection()
  }

  async initLoaders () {
    for (const Loader of Object.values(Loaders)) {
      const loader = new Loader(this)
      try {
        await loader.load()
      } catch (err) {
        console.error(err)
      }
    }
  }

  start () {
    this.initLoaders()
    super.login(this.token)
    return this
  }
}

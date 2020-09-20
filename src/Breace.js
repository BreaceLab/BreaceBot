const { Client, Collection } = require('discord.js')
const Loaders = require('./loader')

const Database = require('./database/Database')

module.exports = class Breace extends Client {
  constructor (options = {}) {
    super(options)
    this.token = options.token
    this.config = {
      database: options.database,
      ...require('../setup.json')
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

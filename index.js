const Breace = require('./src/Breace.js')
const config = require('./config.js')

require('./src/structure/discord')()

const client = new Breace(config)

client.start()

const Breace = require('./src/Breace.js')
const config = require('./config.js')

const client = new Breace(config)

client.start()

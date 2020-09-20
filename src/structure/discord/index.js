const { readdir } = require('fs')

module.exports = () => readdir(__dirname, (e, files) => {
  if (e) throw new Error(e.message)
  for (const file of files.filter(f => f !== 'index.js')) {
    try {
      console.log(`|  [STRUCTURES] [${file}] loaded.`)
      require(`./${file}`)
    } catch (er) {
      console.error(er)
    }
  }
})

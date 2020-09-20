const { readdir } = require('fs')

module.exports = readdir(__dirname, (e, files) => {
  if (e) throw new Error(e.message)
  for (const file of files.filter(f => f !== 'index.js')) {
    try { require(`./${file}`) } catch (er) { console.error(er) }
  }
})

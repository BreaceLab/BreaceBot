module.exports = {
  requireDirectory: require('./requireDirectory.js'),
  Manager: require('./Manager.js'),
  Github: require('./Github.js'),
  safeDM: async (user, content = `Olá \`${user.tag}\`, já vamos começar seu formulário!`) => {
    const dmChannel = user.dmChannel || await user.createDM()
    dmChannel.send(content)
      .then(DMMessage => {
        return DMMessage.channel
      })
      .catch(_ => {
        return null
      })

    return dmChannel
  }
}

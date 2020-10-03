const { Structures, MessageEmbed } = require('discord.js')
const { Manager, Github, safeDM } = require('../../util')

const cooldowns = Manager(60 * 1000)

Structures.extend('Message', (DiscordMessage) => {
  return class Message extends DiscordMessage {
    constructor (...opts) {
      super(...opts)

      this.allowedChannels = this.client.config.channels.commands

      this.suggest()
      this.checkGithub()
    }

    startsWithPrefix () {
      const { prefixes } = this.client.config

      return prefixes.some(prefix => this.content.toLowerCase().startsWith(prefix.toLowerCase()))
    }

    getPrefixOfContent () {
      const { prefixes } = this.client.config
      return prefixes.find(prefix => this.content.toLowerCase().startsWith(prefix.toLowerCase()))
    }

    arguments (prefix) {
      return this.content.slice(prefix.length).trim().split(/ +/g)
    }

    async getUser (_id = this.author.id) {
      let userData = await this.client.database.models.users.findById(_id)
      if (!userData) userData = await this.client.database.models.users.create({ _id })

      return userData
    }

    async giveXp () {
      const userData = await this.getUser()
      const embed = new MessageEmbed().setColor(this.client.config.color)

      if (!cooldowns.has(this.author.id)) {
        this.member.premiumSince ? userData.xp += 10 : userData.xp += 5

        if (userData.xp >= userData.level ** 5 + (100 * (userData.level * 2))) {
          userData.level++
          userData.xp = 0

          embed.setDescription(`Parabéns ${this.author}, você alcançou o nível **${userData.level}**!`)
          this.channel.send(embed)
        }
        userData.save()
        cooldowns.add(this.author.id)
      }
    }

    async suggest () {
      if (this.client.config.channels.suggestions.includes(this.channel.id) && !this.content.startsWith('^')) {
        for (const emoji of this.client.config.reactions.suggestions) await this.react(emoji)
      }
    }

    async checkGithub () {
      if (this.channel.id === this.client.config.channels.recommend.request && !this.author.bot) {
        this.delete()
        const embed = new MessageEmbed().setColor(this.client.config.color)
        let value = this.content
        const GITHUB_REGEX = new RegExp('(https?:\\/\\/)?github(\\.com)\\/(\\S+)')
        if (GITHUB_REGEX.test(this.content)) value = GITHUB_REGEX.exec(this.content)[2]
        const info = await Github.getUser(value.replace(/@/g, ''))

        if (info) {
          const repos = await Github.getRepos(info.login)
          const orgs = await Github.getOrgs(info.login)
          const gists = await Github.getGists(info.login)

          embed.addFields([
            {
              name: 'Informações',
              value: [
                `**Repositórios Públicos:** \`${repos.length}\``,
                `**Organizações:** \`${orgs.length}\``
              ],
              inline: true
            },
            {
              name: '\u200b',
              value: [
                `**Seguidores:** \`${info.followers}\``,
                `**Gists:** \`${gists.length}\``
              ],
              inline: true
            }
          ])

          embed.setThumbnail(info.avatar_url)
          embed.setAuthor(info.name ? `${info.name}  (${info.login})` : info.login, info.avatar_url, info.html_url)
          if (info.bio) embed.setDescription(info.bio)
          embed.setFooter('Membro do Github desde')
          embed.setTimestamp(info.created_at)

          const viewerChannel = this.client.channels.cache.get(this.client.config.channels.recommend.viewer)

          if (viewerChannel) viewerChannel.send(embed).then(() => safeDM(this.author, 'Obrigado por mandar sua solicitação, já iremos ver e vamos responder!'))
        }
      }
    }
  }
})

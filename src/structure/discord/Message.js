const { Structures, MessageEmbed } = require('discord.js')
const { Manager } = require('../../util')

const cooldowns = Manager(60 * 1000)

Structures.extend('Message', (DiscordMessage) => {
  return class Message extends DiscordMessage {
    constructor (...opts) {
      super(...opts)

      this.allowedChannels = this.client.config.channels.commands

      this.suggest()
      this.giveXp()
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
  }
})

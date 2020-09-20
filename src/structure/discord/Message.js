const { Structures, MessageEmbed } = require('discord.js')
const { Manager } = require('../../util')

const cooldowns = Manager(60 * 1000)

Structures.extend('Message', (DiscordMessage) => {
  return class Message extends DiscordMessage {
    constructor (...opts) {
      super(...opts)

      this.allowedChannels = this.client.config.botGuild.channels.commands

      this.levelFeatures = {
        7: {
          reward: 'Aparecer na lista de ativos',
          f: (rewards) => this.member.roles.add(rewards.active)
        },
        4: {
          reward: 'Mudar de apelido',
          f: (rewards) => this.member.roles.add(rewards.nickname)
        }
      }
    }

    startsWithPrefix () {
      const { prefixes } = this.client.config

      return prefixes.some(prefix => this.content.toLowerCase().startsWith(prefix.toLowerCase())) || this.content.toLowerCase().startsWith(this.guild.me.toString())
    }

    getPrefixOfContent () {
      const { prefixes } = this.client.config
      return prefixes.find(prefix => this.content.toLowerCase().startsWith(prefix.toLowerCase()))
    }

    arguments (prefix) {
      return this.content.slice(prefix.length).trim().split(/ +/g)
    }

    async giveXp () {
      const userData = await this.author.data()
      const embed = new MessageEmbed().setColor(this.client.config.defaultColor)

      if (!cooldowns.has(this.author.id)) {
        if (this.member.premiumSince) userData.xp += 10
        else userData.xp += 5

        if (userData.xp >= userData.level ** 5 + (100 * (userData.level * 2))) {
          userData.level++
          userData.xp = 0

          if (this.levelFeatures[userData.level]) {
            embed.setDescription([
              `Parabéns ${this.author}, você alcançou o nível **${userData.level}**!`,
              `Benefícios desbloqueados: ${this.levelFeatures[userData.level].reward}`
            ])

            this.levelFeatures[userData.level].f(this.client.config.rewards)
            this.channel.send(embed)
          } else {
            embed.setDescription(`Parabéns ${this.author}, você alcançou o nível **${userData.level}**!`)

            this.channel.send(embed)
          }

          userData.save()
        }
      }
    }
  }
})

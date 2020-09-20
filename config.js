module.exports = {
  // Discord options
  fetchAllMembers: true,

  // config bot
  token: process.env.TOKEN,
  defaultColor: process.env.COLOR,
  database: process.env.MONGO_URI,
  owners: JSON.parse(process.env.OWNERS),
  prefixes: JSON.parse(process.env.PREFIXES),
  botGuild: JSON.parse(process.env.BOT_GUILD)
}

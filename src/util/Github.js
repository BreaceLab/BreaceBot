const axios = require('axios').default
const baseURL = 'https://api.github.com'

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
})

module.exports = class Github {
  static async getUser (username) {
    try {
      const { data } = await api.get(`/users/${username}`)

      return data
    } catch (e) { return null }
  }

  static async getRepos (username) {
    const { data } = await api.get(`/users/${username}/repos`)

    return data
  }

  static async getOrgs (username) {
    const { data } = await api.get(`/users/${username}/orgs`)

    return data
  }

  static async getGists (username) {
    const { data } = await api.get(`/users/${username}/gists`)

    return data
  }
}

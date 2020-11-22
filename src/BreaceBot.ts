import { Client } from 'discord.js';

export default class BreaceBot {
  public client: Client

  constructor(client: Client) {
    this.client = client;
  }
}

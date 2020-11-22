import { Client } from 'discord.js';
import { config } from 'dotenv';
import 'reflect-metadata';
import BreaceBot from './BreaceBot';

config();

const breace = new BreaceBot(new Client({ disableMentions: 'all' }));
breace.client.login(process.env.token);

export default breace;

import glob from 'glob';
import { Message } from 'discord.js';
import { BaseCommand, CommandData } from './types';
import BreaceBot from '../BreaceBot';
import config from '../../config.json';

class Handler {
    private _commands: CommandData[]

    constructor(breace: BreaceBot) {
      breace.client.on('message', (message: Message) => {
        const prefix = config.prefixes.find(message.content.startsWith);
        if (!prefix || message.author.bot) { return; }

        const args = message.content
          .slice(prefix.length)
          .trim()
          .split(/ +/);

        const cmd = args.shift()?.toLowerCase();

        if (!cmd) {
          return;
        }

        const cmdFinded = this._commands.find(
          (x) => x.commandNames.findIndex((name) => name === cmd) !== -1,
        );
        if (!cmdFinded) {
          return;
        }

        try {
          // eslint-disable-next-line new-cap
          const cmdObj = new cmdFinded.cmdClass() as BaseCommand;
          cmdObj.message = message;
          cmdObj.breace = breace;
          cmdObj.args = args;
          cmdObj.execute();
        } catch (err) {
          console.error(err);
        }
      });

      this._commands = [];
    }

    get commands() {
      return this._commands;
    }

    build() {
      this.registerCommands();
      this.registerEvents();
    }

    private registerCommands() {
      glob('./src/commands/**/*.ts', {
        absolute: true,
      }, async (err, files) => {
        console.log(`Serão carregado: ${files.length} comandos!`);
        let index = 0;
        for (const file of files) {
          // eslint-disable-next-line no-await-in-loop
          const cmd = (await import(file)) as BaseCommand;

          this._commands.push({
            commandNames: Reflect.getMetadata('command:names', cmd),
            cmdClass: cmd,
          });
          console.log(`${index + 1}: ${file} carregado.`);
          index++;
        }

        console.log('\n');
      });
    }

    private registerEvents() {
      glob('./src/events/**/*.ts', {
        absolute: true,
      }, (err, files) => {
        if (err) {
          return console.error(`Não foi possivel registrar os eventos: ${err}`);
        }
        if (files.length === 0) {
          return console.warn('Nenhum evento foi registrado.');
        }
        console.log(`Serão carregado: ${files.length} eventos!`);
        files.forEach((file, index) => {
          import(file).then((x) => {
            x(this);
            console.log(`${index + 1}: ${file} carregado.`);
          });
        });
        console.log('\n');
      });
    }
}

export default Handler;

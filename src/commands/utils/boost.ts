import { BaseCommand, Command, HelpInfo } from '../../handler';

@Command('boost')
@HelpInfo({
  description: 'Mostra as recompensas que você consegue dando boost',
  module: 'Utilitários',
})
export default class Boost extends BaseCommand {
  execute() {
    this.message.reply({
      embed: { color: '' },
    });
  }
}

import { Message } from 'discord.js';
import BreaceBot from '../BreaceBot';

export interface CommandData{
    commandNames: string[]
    cmdClass: any
}

export class HelpData {
    description?: string

    visible?: boolean

    module?: string

    usage?: string[]
}

export abstract class BaseCommand {
    message!: Message

    args!: string[]

    breace!: BreaceBot

    abstract execute(): void
}

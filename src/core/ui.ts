import chalk from 'chalk';
import { CommitMessage } from '../types';
import inquirer from 'inquirer';

export class UI {
  static displayCommitMessage(commitMessage: CommitMessage): void {
    console.log(chalk.blue('\n🎯 Generated Commit Message:'));
    console.log(chalk.green(commitMessage.subject));

    if (commitMessage.body && commitMessage.body.length > 0) {
      console.log();
      commitMessage.body.forEach(line => {
        console.log(chalk.gray(line));
      });
    }
    console.log();
  }

  static async confirmCommit(): Promise<boolean> {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '✅ Accept and commit', value: 'commit' },
          { name: '✏️  Edit message', value: 'edit' },
          { name: '🔄 Regenerate', value: 'regenerate' },
          { name: '❌ Cancel', value: 'cancel' }
        ]
      }
    ]);

    return action === 'commit';
  }

  static async editMessage(commitMessage: CommitMessage): Promise<string> {
    const fullMessage = this.formatCommitMessage(commitMessage);

    const { editedMessage } = await inquirer.prompt([
      {
        type: 'editor',
        name: 'editedMessage',
        message: 'Edit commit message:',
        default: fullMessage
      }
    ]);

    return editedMessage;
  }

  private static formatCommitMessage(commitMessage: CommitMessage): string {
    let result = commitMessage.subject;

    if (commitMessage.body && commitMessage.body.length > 0) {
      result += '\n\n' + commitMessage.body.join('\n');
    }

    return result;
  }

  static success(message: string): void {
    console.log(chalk.green('✅'), message);
  }

  static error(message: string): void {
    console.error(chalk.red('❌'), message);
  }

  static warning(message: string): void {
    console.warn(chalk.yellow('⚠️'), message);
  }

  static info(message: string): void {
    console.log(chalk.blue('ℹ️'), message);
  }
}
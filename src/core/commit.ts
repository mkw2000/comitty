import { execSync } from 'child_process';
import { ComittyError } from './errors';

export class CommitExecutor {
  static execute(message: string): void {
    try {
      // Use the exact message provided
      execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
        encoding: 'utf-8',
        cwd: process.cwd(),
        stdio: 'inherit'
      });
    } catch (error) {
      throw new ComittyError(`Failed to commit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
import { execSync } from 'child_process';
import { ComittyError } from '../core/errors';

export class GitDiff {
  static getStagedDiff(maxSize: number = 10000): string {
    try {
      const diff = execSync('git diff --staged', {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

      if (!diff.trim()) {
        throw new ComittyError('No staged changes found. Stage your changes first with `git add`.');
      }

      // Truncate if too large
      if (diff.length > maxSize) {
        const truncated = diff.substring(0, maxSize);
        const lines = truncated.split('\n');
        const lastCompleteLine = lines.slice(0, -1).join('\n');
        return lastCompleteLine + '\n\n[Diff truncated for brevity...]';
      }

      return diff;
    } catch (error) {
      if (error instanceof ComittyError) {
        throw error;
      }

      if (error instanceof Error && error.message.includes('not a git repository')) {
        throw new ComittyError('Not in a git repository');
      }

      throw new ComittyError(`Failed to get git diff: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static getStagedFiles(): string[] {
    try {
      const output = execSync('git diff --staged --name-only', {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

      return output.trim().split('\n').filter(Boolean);
    } catch (error) {
      throw new ComittyError(`Failed to get staged files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
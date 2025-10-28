import { execSync } from 'child_process';
import { GitContext } from '../types';
import { ComittyError } from '../core/errors';
import { GitDiff } from './diff';

export class GitContext {
  static async collect(): Promise<GitContext> {
    this.validateGitRepository();

    const [stagedDiff, changedFiles, branchName, recentCommits] = await Promise.all([
      Promise.resolve(GitDiff.getStagedDiff()),
      Promise.resolve(GitDiff.getStagedFiles()),
      this.getCurrentBranch(),
      this.getRecentCommits()
    ]);

    return {
      stagedDiff,
      changedFiles,
      branchName,
      recentCommits
    };
  }

  private static validateGitRepository(): void {
    try {
      execSync('git rev-parse --git-dir', {
        encoding: 'utf-8',
        cwd: process.cwd(),
        stdio: 'ignore'
      });
    } catch (error) {
      throw new ComittyError('Not in a git repository');
    }
  }

  private static async getCurrentBranch(): Promise<string> {
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf-8',
        cwd: process.cwd()
      }).trim();

      return branch || 'HEAD';
    } catch (error) {
      throw new ComittyError(`Failed to get current branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async getRecentCommits(count: number = 5): Promise<string[]> {
    try {
      const output = execSync(`git log --oneline -n ${count}`, {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

      return output.trim().split('\n')
        .filter(Boolean)
        .map(line => line.replace(/^\w+\s+/, '')); // Remove hash prefix
    } catch (error) {
      // If we can't get recent commits, return empty array
      console.warn('Warning: Could not fetch recent commits');
      return [];
    }
  }
}
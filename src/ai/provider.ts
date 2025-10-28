import { AIProvider, GitContext, ComittyConfig, CommitMessage } from '../types';
import { AIProviderError } from '../core/errors';

export abstract class BaseAIProvider implements AIProvider {
  protected config: ComittyConfig;

  constructor(config: ComittyConfig) {
    this.config = config;
  }

  abstract generateCommitMessage(context: GitContext, config: ComittyConfig): Promise<CommitMessage>;

  protected parseAIResponse(response: string): CommitMessage {
    const lines = response.trim().split('\n').filter(Boolean);

    if (lines.length === 0) {
      throw new AIProviderError('AI returned empty response');
    }

    const subject = lines[0].trim();

    // Check if it looks like conventional commit format
    const conventionalMatch = subject.match(/^(feat|fix|chore|docs|style|refactor|test|perf)(\(.+\))?:\s*(.+)$/);
    if (this.config.style === 'conventional' && !conventionalMatch) {
      // If conventional style requested but not provided, we can either:
      // 1. Accept it as is (less strict)
      // 2. Try to fix it by adding "chore:" prefix
      // For now, we'll accept it as is
    }

    const body = lines.length > 1 ? lines.slice(1).map(line => line.trim()) : undefined;

    return {
      subject,
      body: body && body.length > 0 ? body : undefined
    };
  }

  protected validateResponse(response: string): void {
    if (!response || response.trim().length === 0) {
      throw new AIProviderError('Empty response from AI provider');
    }

    if (response.length > 1000) {
      throw new AIProviderError('AI response too long, possible error');
    }
  }
}
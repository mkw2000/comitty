import { AIProviderFactory } from '../ai/factory';
import { GitContext } from '../git/context';
import { ComittyConfig, CommitMessage } from '../types';
import { ComittyError, AIProviderError } from './errors';

export class CommitMessageGenerator {
  private config: ComittyConfig;

  constructor(config: ComittyConfig) {
    this.config = config;
  }

  async generate(): Promise<CommitMessage> {
    try {
      // Collect git context
      const context = await GitContext.collect();

      // Create AI provider
      const provider = AIProviderFactory.create(this.config);

      // Generate commit message
      const commitMessage = await provider.generateCommitMessage(context, this.config);

      return commitMessage;
    } catch (error) {
      if (error instanceof ComittyError) {
        throw error;
      }
      throw new ComittyError(`Failed to generate commit message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  formatCommitMessage(commitMessage: CommitMessage): string {
    let result = commitMessage.subject;

    if (commitMessage.body && commitMessage.body.length > 0) {
      result += '\n\n' + commitMessage.body.join('\n');
    }

    if (this.config.explain && commitMessage.reasoning) {
      result += '\n\n---\nReasoning: ' + commitMessage.reasoning;
    }

    return result;
  }
}
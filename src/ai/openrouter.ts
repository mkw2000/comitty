import { BaseAIProvider } from './provider';
import { GitContext, ComittyConfig, CommitMessage } from '../types';
import { AIProviderError } from '../core/errors';

export class OpenRouterProvider extends BaseAIProvider {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly defaultModel = 'anthropic/claude-3-haiku';

  async generateCommitMessage(context: GitContext, config: ComittyConfig): Promise<CommitMessage> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new AIProviderError('OpenRouter API key not found. Set OPENROUTER_API_KEY environment variable or configure in settings.');
    }

    const prompt = this.buildPrompt(context, config);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/comitty/comitty-cli',
          'X-Title': 'Comitty CLI',
        },
        body: JSON.stringify({
          model: config.model || this.defaultModel,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(config)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 200,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AIProviderError(`OpenRouter API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new AIProviderError('Invalid response from OpenRouter API');
      }

      this.validateResponse(content);
      return this.parseAIResponse(content);
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new AIProviderError(`Failed to generate commit message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getApiKey(): string | undefined {
    if (this.config.apiKey) {
      return this.config.apiKey;
    }
    return process.env.OPENROUTER_API_KEY;
  }

  private getSystemPrompt(config: ComittyConfig): string {
    return `You are 'Comitty', an AI that generates excellent Git commit messages. Rules:
- Imperative tense
- One subject line <= 72 characters
- Optional bullets (≤ 5, concise)
- No markdown blocks, no code formatting
- If style=conventional, prefix type (feat, fix, chore, docs, style, refactor, test, perf). If unsure: chore.
- Infer intent from diff and branch name but do not hallucinate functionality.
- Respect privacy: do not reveal secrets or tokens.
- Output only the commit message, no additional commentary.`;
  }

  private buildPrompt(context: GitContext, config: ComittyConfig): string {
    return `STYLE: ${config.style}
BRANCH: ${context.branchName}
FILES: ${context.changedFiles.join(', ')}
RECENT: ${context.recentCommits.join('; ')}

DIFF:
${context.stagedDiff}`;
  }
}
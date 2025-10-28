import { AIProvider, ComittyConfig } from '../types';
import { OpenRouterProvider } from './openrouter';
import { ConfigError } from '../core/errors';

export class AIProviderFactory {
  static create(config: ComittyConfig): AIProvider {
    switch (config.provider) {
      case 'openrouter':
        return new OpenRouterProvider(config);
      case 'openai':
        // TODO: Implement OpenAI provider
        throw new ConfigError('OpenAI provider not yet implemented');
      case 'anthropic':
        // TODO: Implement Anthropic provider
        throw new ConfigError('Anthropic provider not yet implemented');
      default:
        throw new ConfigError(`Unknown AI provider: ${config.provider}`);
    }
  }
}
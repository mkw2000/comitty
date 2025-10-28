export class ComittyError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ComittyError';
  }
}

export class ConfigError extends ComittyError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigError';
  }
}

export class GitError extends ComittyError {
  constructor(message: string) {
    super(message, 'GIT_ERROR');
    this.name = 'GitError';
  }
}

export class AIProviderError extends ComittyError {
  constructor(message: string) {
    super(message, 'AI_PROVIDER_ERROR');
    this.name = 'AIProviderError';
  }
}
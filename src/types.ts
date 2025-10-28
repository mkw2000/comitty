export interface ComittyConfig {
  style: 'conventional' | 'natural';
  provider: 'openrouter' | 'openai' | 'anthropic';
  model?: string;
  apiKey?: string;
  autoCommit?: boolean;
  explain?: boolean;
  maxDiffSize?: number;
}

export interface GitContext {
  stagedDiff: string;
  changedFiles: string[];
  branchName: string;
  recentCommits: string[];
}

export interface CommitMessage {
  subject: string;
  body?: string[];
  reasoning?: string;
}

export interface AIProvider {
  generateCommitMessage(context: GitContext, config: ComittyConfig): Promise<CommitMessage>;
}
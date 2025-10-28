#!/usr/bin/env node

import { Command } from 'commander';
import { ConfigLoader } from './config/load';
import { CommitMessageGenerator } from './core/generate';
import { UI } from './core/ui';
import { CommitExecutor } from './core/commit';
import { ComittyError, ConfigError } from './core/errors';

const program = new Command();

program
  .name('comitty')
  .description('AI-powered commit message generator for Git')
  .version('1.0.0');

program
  .option('-s, --style <style>', 'Commit message style (conventional|natural)', 'conventional')
  .option('-p, --provider <provider>', 'AI provider (openrouter|openai|anthropic)', 'openrouter')
  .option('-m, --model <model>', 'AI model to use')
  .option('-k, --api-key <key>', 'API key for the AI provider')
  .option('--auto-commit', 'Automatically commit without confirmation', false)
  .option('--explain', 'Include AI reasoning in output', false)
  .option('-r, --regenerate', 'Regenerate commit message', false)
  .action(async (options) => {
    try {
      await runComitty(options);
    } catch (error) {
      handleError(error);
      process.exit(1);
    }
  });

async function runComitty(options: any): Promise<void> {
  // Load configuration
  const configLoader = new ConfigLoader();
  const config = await configLoader.loadConfig();

  // Override config with CLI options
  const finalConfig = {
    ...config,
    style: options.style || config.style,
    provider: options.provider || config.provider,
    model: options.model || config.model,
    apiKey: options.apiKey || config.apiKey,
    autoCommit: options.autoCommit || config.autoCommit,
    explain: options.explain || config.explain,
  };

  // Validate API key
  const apiKey = configLoader.getApiKey(finalConfig);
  if (!apiKey) {
    throw new ConfigError(`API key required for ${finalConfig.provider}. Set ${finalConfig.provider.toUpperCase()}_API_KEY environment variable or configure in settings.`);
  }

  UI.info('Analyzing staged changes...');

  // Generate commit message
  const generator = new CommitMessageGenerator(finalConfig);
  let commitMessage = await generator.generate();

  let shouldCommit = false;

  do {
    // Display the generated message
    UI.displayCommitMessage(commitMessage);

    if (finalConfig.autoCommit) {
      shouldCommit = true;
      break;
    }

    // Ask user what to do
    const action = await getUserAction();

    switch (action) {
      case 'commit':
        shouldCommit = true;
        break;
      case 'edit':
        commitMessage = await editCommitMessage(commitMessage);
        // After editing, commit automatically
        shouldCommit = true;
        break;
      case 'regenerate':
        UI.info('Regenerating commit message...');
        commitMessage = await generator.generate();
        break;
      case 'cancel':
        UI.info('Commit cancelled.');
        return;
    }
  } while (!shouldCommit);

  // Execute the commit
  if (shouldCommit) {
    const message = generator.formatCommitMessage(commitMessage);
    CommitExecutor.execute(message);
    UI.success('Commit successful!');
  }
}

async function getUserAction(): Promise<string> {
  const inquirer = await import('inquirer');
  const { action } = await inquirer.default.prompt([
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

  return action;
}

async function editCommitMessage(commitMessage: any): Promise<any> {
  const inquirer = await import('inquirer');
  const generator = new CommitMessageGenerator({} as any);

  const fullMessage = generator.formatCommitMessage(commitMessage);

  const { editedMessage } = await inquirer.default.prompt([
    {
      type: 'editor',
      name: 'editedMessage',
      message: 'Edit commit message:',
      default: fullMessage
    }
  ]);

  // Parse the edited message back into commit message format
  const lines = editedMessage.trim().split('\n');
  const subject = lines[0] || '';
  const body = lines.length > 1 ? lines.slice(1).filter(line => line.trim()) : undefined;

  return {
    subject,
    body: body && body.length > 0 ? body : undefined
  };
}

function handleError(error: unknown): void {
  if (error instanceof ComittyError) {
    UI.error(error.message);
    if (error.code === 'GIT_ERROR') {
      UI.info('Make sure you are in a git repository and have staged changes.');
    }
  } else if (error instanceof Error) {
    UI.error(`Unexpected error: ${error.message}`);
  } else {
    UI.error('An unknown error occurred');
  }
}

// Make CLI executable
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
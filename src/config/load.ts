import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';
import { ComittyConfig } from '../types';

const DEFAULT_CONFIG: ComittyConfig = {
  style: 'conventional',
  provider: 'openrouter',
  autoCommit: false,
  explain: false,
  maxDiffSize: 10000,
};

export class ConfigLoader {
  private globalConfigPath: string;
  private projectConfigPath: string;

  constructor(cwd: string = process.cwd()) {
    this.globalConfigPath = join(homedir(), '.config', 'comitty', 'config.json');
    this.projectConfigPath = join(cwd, '.comittyrc');
  }

  async loadConfig(): Promise<ComittyConfig> {
    const globalConfig = await this.loadGlobalConfig();
    const projectConfig = await this.loadProjectConfig();

    return {
      ...DEFAULT_CONFIG,
      ...globalConfig,
      ...projectConfig,
    };
  }

  private async loadGlobalConfig(): Promise<Partial<ComittyConfig>> {
    try {
      if (!existsSync(this.globalConfigPath)) {
        await this.createGlobalConfig();
        return {};
      }

      const content = await readFile(this.globalConfigPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Warning: Could not load global config from ${this.globalConfigPath}:`, error);
      return {};
    }
  }

  private async loadProjectConfig(): Promise<Partial<ComittyConfig>> {
    try {
      if (!existsSync(this.projectConfigPath)) {
        return {};
      }

      const content = await readFile(this.projectConfigPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Warning: Could not load project config from ${this.projectConfigPath}:`, error);
      return {};
    }
  }

  private async createGlobalConfig(): Promise<void> {
    try {
      const configDir = join(homedir(), '.config', 'comitty');
      await mkdir(configDir, { recursive: true });

      const templateConfig = {
        ...DEFAULT_CONFIG,
        // Add helpful comments for user
        _comment: "Edit this file to configure Comitty. Available options: style (conventional|natural), provider (openrouter|openai|anthropic), model, apiKey, autoCommit (boolean), explain (boolean), maxDiffSize (number)"
      };

      await writeFile(this.globalConfigPath, JSON.stringify(templateConfig, null, 2));
      console.log(`Created default config at ${this.globalConfigPath}`);
    } catch (error) {
      console.warn(`Warning: Could not create global config directory:`, error);
    }
  }

  getApiKey(config: ComittyConfig): string | undefined {
    // Priority: config.apiKey > environment variables
    if (config.apiKey) {
      return config.apiKey;
    }

    switch (config.provider) {
      case 'openrouter':
        return process.env.OPENROUTER_API_KEY;
      case 'openai':
        return process.env.OPENAI_API_KEY;
      case 'anthropic':
        return process.env.ANTHROPIC_API_KEY;
      default:
        return undefined;
    }
  }
}
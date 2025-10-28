# Comitty

AI-powered commit message generator for Git. Comitty analyzes your staged Git changes and automatically generates high-quality commit messages using AI.

## Features

- > AI-powered commit message generation
- =� Supports conventional and natural commit styles
- =' Configurable AI providers (OpenRouter, OpenAI, Anthropic)
- � Fast startup with Bun runtime
- <� Analyzes only staged changes (never unstaged)
- =� Git context awareness (branch, recent commits, changed files)
-  Interactive editing and regeneration
- � Global and project-specific configuration

## Installation

### npm (recommended)
```bash
npm install -g comitty
```

### Build from source
```bash
git clone https://github.com/your-username/comitty.git
cd comitty
npm install
npm run build
npm link
```

## Quick Start

1. Stage your changes:
```bash
git add .
```

2. Generate and commit:
```bash
comitty
```

That's it! Comitty will analyze your staged changes, generate a commit message, and ask for your confirmation before committing.

## Configuration

### Global Configuration

Comitty creates a global config file at `~/.config/comitty/config.json` on first run:

```json
{
  "style": "conventional",
  "provider": "openrouter",
  "autoCommit": false,
  "explain": false,
  "maxDiffSize": 10000,
  "_comment": "Edit this file to configure Comitty"
}
```

### Project Configuration

Create a `.comittyrc` file in your project root to override global settings:

```json
{
  "style": "natural",
  "provider": "openai",
  "model": "gpt-4"
}
```

### Environment Variables

Set API keys via environment variables:

```bash
# OpenRouter (recommended)
export OPENROUTER_API_KEY="your-api-key-here"

# OpenAI
export OPENAI_API_KEY="your-api-key-here"

# Anthropic
export ANTHROPIC_API_KEY="your-api-key-here"
```

## Usage

### Basic Usage

```bash
# Generate commit message interactively
comitty

# Auto-commit without confirmation
comitty --auto-commit

# Use natural language style
comitty --style natural

# Use different AI provider
comitty --provider openai
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-s, --style <style>` | Commit style (conventional|natural) | conventional |
| `-p, --provider <provider>` | AI provider (openrouter|openai|anthropic) | openrouter |
| `-m, --model <model>` | Specific AI model to use | provider default |
| `-k, --api-key <key>` | API key (overrides env vars) | - |
| `--auto-commit` | Skip confirmation and auto-commit | false |
| `--explain` | Include AI reasoning in output | false |
| `-r, --regenerate` | Regenerate if previously generated | false |
| `-h, --help` | Show help | - |

### Interactive Workflow

1. **Generate**: Comitty analyzes staged changes and generates a commit message
2. **Review**: See the generated message with context
3. **Choose**:
   -  Accept and commit
   -  Edit the message
   - = Regenerate a new message
   - L Cancel

## Commit Styles

### Conventional Commits
```
feat: add user authentication system
fix: resolve memory leak in data processing
chore: update dependencies and cleanup imports
```

### Natural Language
```
Add user authentication system
Fix memory leak in data processing
Update dependencies and cleanup imports
```

## AI Providers

### OpenRouter (Recommended)
- Best for flexibility and cost-effectiveness
- Supports multiple models (Claude, GPT, Llama, etc.)
- Get API key: https://openrouter.ai/keys

```bash
export OPENROUTER_API_KEY="your-openrouter-key"
comitty --provider openrouter --model anthropic/claude-3-haiku
```

### OpenAI
- GPT-3.5 and GPT-4 models
- Get API key: https://platform.openai.com/api-keys

```bash
export OPENAI_API_KEY="your-openai-key"
comitty --provider openai --model gpt-4
```

### Anthropic
- Claude models
- Get API key: https://console.anthropic.com/

```bash
export ANTHROPIC_API_KEY="your-anthropic-key"
comitty --provider anthropic --model claude-3-opus
```

## Configuration Examples

### TypeScript Project (.comittyrc)
```json
{
  "style": "conventional",
  "provider": "openrouter",
  "model": "anthropic/claude-3-haiku",
  "autoCommit": false
}
```

### Python Project (.comittyrc)
```json
{
  "style": "natural",
  "provider": "openai",
  "model": "gpt-4",
  "explain": true
}
```

### Global Setup
```bash
# Set your preferred provider globally
cat ~/.config/comitty/config.json
```

## Troubleshooting

### "No staged changes found"
```bash
git add .  # Stage your changes first
```

### "API key not found"
```bash
export OPENROUTER_API_KEY="your-key"
# or configure in ~/.config/comitty/config.json
```

### "Not in a git repository"
```bash
cd /path/to/your/git/repo
```

### Large diffs get truncated
```json
{
  "maxDiffSize": 20000  // Increase limit in config
}
```

## Development

```bash
# Install dependencies
bun install

# Run in development
bun run dev

# Build for production
bun run build

# Test
bun test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- = Report bugs: https://github.com/your-username/comitty/issues
- =� Feature requests: https://github.com/your-username/comitty/discussions
- =� Documentation: https://github.com/your-username/comitty/wiki

---

Made with d by the Comitty team
# Publishing Guide

This document outlines how to publish Comitty to npm.

## Prerequisites

1. **npm account**: Create an account at https://www.npmjs.com/signup
2. **Login locally**: Run `npm login`
3. **Verify package name**: `comitty` is available (confirmed)

## Pre-publishing Checklist

- [x] Package.json is properly configured
- [x] LICENSE file included (MIT)
- [x] README.md is comprehensive
- [x] .npmignore configured correctly
- [x] Build process works (`npm run build`)
- [x] Package contents verified (`npm pack --dry-run`)
- [x] Executable shebang present
- [x] Dependencies are minimal and appropriate

## Publishing Steps

### 1. Final Build
```bash
npm run build
```

### 2. Dry Run (verify package contents)
```bash
npm pack --dry-run
```

### 3. Publish to npm
```bash
npm publish
```

### 4. Verify Publication
```bash
npm view comitty
npm install -g comitty  # Test installation
```

## Package Contents

The published package includes:
- `dist/cli.js` - Built CLI executable
- `README.md` - Documentation
- `LICENSE` - MIT license
- `.comittyrc.example` - Example configuration
- `package.json` - Package metadata

## Version Management

- Current version: `1.0.0`
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update version in package.json before publishing new releases

## Post-Publishing

1. **Create GitHub release** with version notes
2. **Update documentation** if needed
3. **Monitor for issues** and user feedback
4. **Prepare next version** if needed

## Troubleshooting

### Publishing Errors
- **403 Forbidden**: Check npm login and package ownership
- **Package name taken**: Choose alternative name
- **Validation errors**: Check package.json format

### Installation Issues
- **Permission denied**: Use `sudo` or fix npm permissions
- **Command not found**: Check npm global bin directory
- **Build failures**: Ensure Node.js version compatibility

## Alternative Publishing Options

If `comitty` becomes unavailable:
- `comitty-cli`
- `comitty-ai`
- `git-comitty`
- `ai-commit-generator`

## Security Considerations

- No sensitive data in package
- Dependencies are audited regularly
- API keys handled via environment variables
- No telemetry or data collection
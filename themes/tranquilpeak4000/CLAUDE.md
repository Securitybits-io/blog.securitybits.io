# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hugo Tranquilpeak 4000 is a modernized fork of the hugo-tranquilpeak-theme. It's a responsive Hugo theme with modern build processes and comprehensive GitHub Actions workflows for testing and quality assurance.

## Development Commands

### Build and Development
- `npm run start` - Build theme and start watch mode for development (includes build + watch task)
- `npm run build` - Same as start (development build with watch)
- `npm run grunt -- build` - Build theme once without watch mode (use this for one-time builds)
- `npm run prod` - Build theme for production with optimizations (concat, minify)
- `hugo server` - Run Hugo development server (requires Hugo to be installed)
- `npm run serve` - Setup theme and start Hugo server in background with nohup

#### Setup for Testing/Development
Before running tests or Hugo server, ensure assets are properly built:

1. **CRITICAL**: Always run `npm run grunt -- build` first to build CSS/JS assets
2. **Assets Location**: Built assets are placed in `/static/css/tranquilpeak.css` and `/static/js/tranquilpeak.js`
3. **ExampleSite Setup**: Use `./setup-examplesite.sh` to properly configure the example site with theme files
4. **Asset Linking**: The build process updates `layouts/partials/head.html` and `layouts/partials/script.html` with correct asset paths

**Common Issues:**
- If tests fail with 404 errors for JS/CSS files, run `npm run grunt -- build` to regenerate assets
- The setup script will skip asset building if `node_modules` is missing - ensure dependencies are installed first
- Favicon should be configured in `exampleSite/config.toml` using the `favicon` parameter (defaults to `/favicon.png`)

### Code Quality
- `npm run lint` - Run ESLint for JavaScript code style checking
- `npm run grunt` - Run Grunt task runner directly

### End-to-End Testing with Playwright
- `npm run test:e2e` - Run all Playwright end-to-end tests
- `npm run test:e2e:ui` - Run tests with Playwright UI mode for debugging
- `npm run test:e2e:headed` - Run tests in headed mode (visible browser)
- `npm run test:e2e:debug` - Run tests in debug mode with step-by-step execution
- `npm run test:e2e:report` - View the latest test report
- `npm run test:visual` - Run visual regression tests only
- `npm run test:all` - Run both Jest unit tests and Playwright e2e tests

#### Test Coverage
The Playwright setup includes comprehensive automated front-end issue detection:
- **Theme Validation**: Responsive design, navigation, images, CSS/JS resources, forms, accessibility
- **Content Validation**: Homepage structure, blog posts, archive pages, search functionality, RSS feeds
- **Visual Regression**: Cross-browser visual comparison, responsive screenshots, UI component states

### Build Tools
The project uses Grunt for asset processing:
- CSS compilation from SCSS
- JavaScript concatenation and minification
- Asset synchronization and optimization

## Architecture

### Core Structure
- **layouts/**: Hugo template files (partials, shortcodes, single/list templates)
- **assets/**: Source SCSS and JavaScript files
- **static/**: Final compiled CSS/JS assets 
- **i18n/**: Internationalization files for 15+ languages
- **exampleSite/**: Demo site with example configuration

### Theme Configuration
- `config.toml` in exampleSite shows all available theme parameters
- Minimum Hugo version: 0.128 (specified in theme.toml)
- Uses Goldmark renderer with unsafe HTML enabled

### Asset Pipeline
- SCSS follows 7-1 pattern architecture
- JavaScript is modular with separate files for each feature (sidebar, header, galleries, etc.)
- Grunt handles compilation and optimization
- Development vs production builds with different asset linking

### Key Features
- Responsive design with configurable sidebar behavior
- Multi-language support (15+ languages)
- Syntax highlighting with highlight.js
- Image galleries and cover images
- Social sharing options
- Comment integration (Disqus, Gitalk)
- Google Analytics integration

## Testing and CI/CD

The project has comprehensive GitHub Actions workflows:
- **Multi-version Hugo testing**: Tests against Hugo 0.128.0, 0.140.0, 0.148.1, and 0.149.0
- **Code quality checks**: ESLint, security audits, theme structure validation
- **Latest version monitoring**: Weekly tests against latest Hugo versions
- **Asset compilation validation**: Ensures CSS/JS assets compile correctly

Main workflow files:
- `.github/workflows/test.yml` - Main testing workflow
- `.github/workflows/lint.yml` - Code quality and structure checks  
- `.github/workflows/test-latest.yml` - Latest Hugo version testing
- `.github/workflows/e2e-tests.yml` - End-to-end testing with Playwright MCP integration

## Development Guidelines

### Code Style
- JavaScript follows Google ESLint configuration
- SCSS follows 7-1 pattern with organized component structure
- Hugo templates use standard Hugo templating conventions

### Theme Development
1. Source files are in `assets/` and `layouts/`
2. **IMPORTANT**: Before running Hugo server, you must build assets first:
   - Run `npm run grunt -- build` to build assets once
   - OR run `npm run start` for development with auto-rebuild (includes watch mode)
3. Assets are compiled to `/static/css/tranquilpeak.css` and `/static/js/tranquilpeak.js`
4. Run `npm run lint` before committing changes
5. Test with `hugo server` using the exampleSite (or use `npm run serve` for convenience)
6. Use `npm run prod` for production builds

### Modern Hugo Compatibility
This fork specifically addresses modern Hugo compatibility:
- Updated pagination config for Hugo v0.128+
- Fixed deprecated Google Analytics templates
- Updated all `.Site.Author` references to `.Site.Params.Author`
- Fixed Disqus configuration
- Added Goldmark renderer configuration
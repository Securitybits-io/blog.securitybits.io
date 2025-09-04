# Hugo Tranquilpeak 4000

A gorgeous responsive theme for Hugo blog framework.

[![Tests](https://github.com/petems/hugo-tranquilpeak-4000/workflows/E2E%20Tests%20with%20Playwright/badge.svg)](https://github.com/petems/hugo-tranquilpeak-4000/actions?query=workflow%3A%22E2E+Tests+with+Playwright%22)

## 🎨 Features

- **Responsive Design**: Mobile-first approach with beautiful layouts
- **Modern UI**: Clean and elegant design with smooth animations
- **Customizable**: Extensive configuration options
- **Fast**: Optimized for performance and SEO
- **Accessible**: WCAG compliant with proper semantic markup
- **Multilingual**: Built-in internationalization support
- **Rich Content**: Support for images, videos, code highlighting, and more

## 🚀 Quick Start

### Prerequisites

- Hugo Extended 0.128+
- Node.js 20+ (for development and testing)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/petems/hugo-tranquilpeak-4000.git
   cd hugo-tranquilpeak-4000
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build assets**:

   ```bash
   npm run build
   ```

4. **Setup example site**:

   ```bash
   ./setup-examplesite.sh
   ```

5. **Start development server**:
   ```bash
   cd exampleSite
   hugo server --buildDrafts --buildFuture --disableFastRender
   ```

Visit `http://localhost:1313` to see your site!

## 🧪 Testing

This theme includes comprehensive end-to-end testing using Playwright.

### Setup Testing Environment

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Build assets and setup exampleSite
npm run build
./setup-examplesite.sh
```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run visual regression tests
npm run test:visual

# Run tests with UI (for debugging)
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# Generate baseline screenshots for visual tests
npm run test:visual:baselines:all

# Update visual test snapshots
npm run test:visual:update
```

### CI/CD

The project includes GitHub Actions workflows for automated testing:

- **E2E Tests**: Runs comprehensive end-to-end tests on multiple browsers
- **Visual Regression**: Ensures UI consistency across changes
- **Test Summary**: Provides detailed test results and artifacts

### Test Structure

- `e2e/theme-validation.spec.js` - Core theme functionality tests
- `e2e/content-validation.spec.js` - Content and page structure tests
- `e2e/visual-regression.spec.js` - Visual consistency tests

### Configuration

- `playwright.config.js` - Local development configuration
- `playwright.config.js` - Main configuration with CI/CD optimizations built-in

## 📁 Project Structure

```
hugo-tranquilpeak-4000/
├── assets/              # Source assets (SCSS, JS)
├── layouts/             # Hugo templates
├── static/              # Static files (images, fonts, etc.)
├── archetypes/          # Content templates
├── i18n/                # Internationalization files
├── exampleSite/         # Example Hugo site
├── e2e/                 # Playwright test files
├── tasks/               # Grunt build tasks
├── docs/                # Documentation
└── tests/               # Unit tests
```

## 🛠️ Development

### Build Commands

```bash
# Development build (with source maps)
npm start

# Production build
npm run build

# Watch for changes
npm run grunt -- watch
```

### Available Scripts

- `npm start` - Start development server with file watching
- `npm run build` - Build production assets
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run test:visual` - Run visual regression tests

## 📖 Documentation

- [Theme Configuration](docs/configuration.md)
- [Content Types](docs/content-types.md)
- [Customization](docs/customization.md)
- [Deployment](docs/deployment.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:all`
5. Submit a pull request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This theme is based on the original [Tranquilpeak theme](https://github.com/kakawait/hugo-tranquilpeak-theme) by [Thibaud Leprêtre](https://github.com/kakawait).

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/petems/hugo-tranquilpeak-4000/issues)
- **Discussions**: [GitHub Discussions](https://github.com/petems/hugo-tranquilpeak-4000/discussions)
- **Documentation**: [Wiki](https://github.com/petems/hugo-tranquilpeak-4000/wiki)

---

Made with ❤️ by the Hugo community

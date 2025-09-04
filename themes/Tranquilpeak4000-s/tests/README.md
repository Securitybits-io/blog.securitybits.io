# Unit Tests

This directory contains unit tests for the Hugo Tranquilpeak theme JavaScript files.

## Test Structure

- `setup.js` - Jest setup file with DOM mocks
- `*.test.js` - Individual test files for each JavaScript module

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The tests cover the main JavaScript functionality:

- **smartresize.test.js** - Tests the debounced resize functionality
- **tabbed-codeblocks.test.js** - Tests the tabbed code block feature
- **header.test.js** - Tests the header scroll behavior

## Adding New Tests

1. Create a new test file following the naming convention: `[filename].test.js`
2. Mock jQuery and DOM elements as needed
3. Test the main functionality and edge cases
4. Ensure tests are isolated and don't depend on each other

## Mocking

The tests use Jest's mocking capabilities to simulate:
- jQuery functionality
- DOM elements and events
- Browser APIs (ResizeObserver, IntersectionObserver, etc.)
- Timer functions (setInterval, setTimeout) 
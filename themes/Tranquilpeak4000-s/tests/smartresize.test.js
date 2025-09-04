// Mock jQuery
global.$ = global.jQuery = jest.fn(() => ({
  bind: jest.fn(),
  trigger: jest.fn()
}));

// Mock jQuery.fn
global.jQuery.fn = {};

// Load the smartresize module
require('../assets/js/smartresize.js');

describe('smartresize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should add smartresize method to jQuery', () => {
    expect($.fn.smartresize).toBeDefined();
    expect(typeof $.fn.smartresize).toBe('function');
  });

  test('should bind resize event when function is provided', () => {
    const mockFn = jest.fn();
    const mockElement = {bind: jest.fn(), trigger: jest.fn()};
    $(mockElement);

    $.fn.smartresize.call(mockElement, mockFn);

    expect(mockElement.bind).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('should trigger smartresize event when no function is provided', () => {
    const mockElement = {bind: jest.fn(), trigger: jest.fn()};
    $(mockElement);

    $.fn.smartresize.call(mockElement);

    expect(mockElement.trigger).toHaveBeenCalledWith('smartresize');
  });

  test('should debounce function calls', () => {
    const mockFn = jest.fn();
    const mockElement = {bind: jest.fn(), trigger: jest.fn()};
    $(mockElement);

    $.fn.smartresize.call(mockElement, mockFn);

    // Get the debounced function
    const debouncedFn = mockElement.bind.mock.calls[0][1];

    // Call the debounced function multiple times
    debouncedFn();
    debouncedFn();
    debouncedFn();

    // Function should only be called once after the timeout
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

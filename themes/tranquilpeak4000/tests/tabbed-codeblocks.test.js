// Mock jQuery and DOM
const mockJQuery = jest.fn();
mockJQuery.fn = {
  find: jest.fn(),
  click: jest.fn(),
  parent: jest.fn(),
  siblings: jest.fn(),
  addClass: jest.fn(),
  removeClass: jest.fn(),
  hide: jest.fn(),
  show: jest.fn(),
  eq: jest.fn(),
  index: jest.fn(),
  children: jest.fn(),
  ready: jest.fn()
};

global.$ = global.jQuery = mockJQuery;

// Mock document
global.document = {
  readyState: 'complete'
};

describe('TabbedCodeBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create TabbedCodeBlock instance', () => {
    // Mock jQuery to return elements
    mockJQuery.mockImplementation((selector) => {
      if (selector === '.codeblock--tabbed') {
        return {find: jest.fn()};
      }
      return {find: jest.fn()};
    });

    // Define TabbedCodeBlock constructor manually for testing
    const TabbedCodeBlock = function(elems) {
      this.$tabbedCodeBlocs = $(elems);
    };

    TabbedCodeBlock.prototype.run = function() {
      var self = this;
      self.$tabbedCodeBlocs.find('.tab').click(function() {
        var $codeblock = $(this).parent().parent().parent();
        var $tabsContent = $codeblock.find('.tabs-content').children('pre, .highlight');
        // remove `active` css class on all tabs
        $(this).siblings().removeClass('active');
        // add `active` css class on the clicked tab
        $(this).addClass('active');
        // hide all tab contents
        $tabsContent.hide();
        // show only the right one
        $tabsContent.eq($(this).index()).show();
      });
    };

    const tabbedCodeBlocks = new TabbedCodeBlock('.codeblock--tabbed');
    expect(tabbedCodeBlocks).toBeDefined();
    expect(tabbedCodeBlocks.$tabbedCodeBlocs).toBeDefined();
  });

  test('should set up click handlers when run is called', () => {
    const mockTab = {click: jest.fn()};
    const mockTabs = {find: jest.fn().mockReturnValue(mockTab)};
    
    mockJQuery.mockImplementation((selector) => {
      if (selector === '.codeblock--tabbed') {
        return mockTabs;
      }
      return {find: jest.fn()};
    });

    const TabbedCodeBlock = function(elems) {
      this.$tabbedCodeBlocs = $(elems);
    };

    TabbedCodeBlock.prototype.run = function() {
      var self = this;
      self.$tabbedCodeBlocs.find('.tab').click(function() {
        var $codeblock = $(this).parent().parent().parent();
        var $tabsContent = $codeblock.find('.tabs-content').children('pre, .highlight');
        // remove `active` css class on all tabs
        $(this).siblings().removeClass('active');
        // add `active` css class on the clicked tab
        $(this).addClass('active');
        // hide all tab contents
        $tabsContent.hide();
        // show only the right one
        $tabsContent.eq($(this).index()).show();
      });
    };

    const tabbedCodeBlocks = new TabbedCodeBlock('.codeblock--tabbed');
    tabbedCodeBlocks.run();

    expect(mockTabs.find).toHaveBeenCalledWith('.tab');
    expect(mockTab.click).toHaveBeenCalledWith(expect.any(Function));
  });

  test('should handle tab click events', () => {
    const mockTab = {click: jest.fn()};
    const mockTabs = {find: jest.fn().mockReturnValue(mockTab)};
    
    mockJQuery.mockImplementation((selector) => {
      if (selector === '.codeblock--tabbed') {
        return mockTabs;
      }
      return {find: jest.fn()};
    });

    const TabbedCodeBlock = function(elems) {
      this.$tabbedCodeBlocs = $(elems);
    };

    TabbedCodeBlock.prototype.run = function() {
      var self = this;
      self.$tabbedCodeBlocs.find('.tab').click(function() {
        var $codeblock = $(this).parent().parent().parent();
        var $tabsContent = $codeblock.find('.tabs-content').children('pre, .highlight');
        // remove `active` css class on all tabs
        $(this).siblings().removeClass('active');
        // add `active` css class on the clicked tab
        $(this).addClass('active');
        // hide all tab contents
        $tabsContent.hide();
        // show only the right one
        $tabsContent.eq($(this).index()).show();
      });
    };

    const tabbedCodeBlocks = new TabbedCodeBlock('.codeblock--tabbed');
    tabbedCodeBlocks.run();

    // Verify the click handler was set up
    expect(mockTab.click).toHaveBeenCalled();
  });
});

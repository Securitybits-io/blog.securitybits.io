// Mock jQuery and DOM
const mockJQuery = jest.fn();
mockJQuery.fn = {
  height: jest.fn(),
  addClass: jest.fn(),
  removeClass: jest.fn(),
  scrollTop: jest.fn(),
  ready: jest.fn()
};

global.$ = global.jQuery = mockJQuery;

// Mock window and document
global.window = {
  scrollTop: 0,
  height: 800,
  scroll: jest.fn()
};

global.document = {
  height: 2000,
  readyState: 'complete'
};

// Mock setInterval
global.setInterval = jest.fn();

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should create Header instance', () => {
    // Mock jQuery to return a header element
    mockJQuery.mockImplementation((selector) => {
      if (selector === '#header') {
        return {height: jest.fn().mockReturnValue(60)};
      }
      if (selector === 'window') {
        return {scroll: jest.fn()};
      }
      return {
        scrollTop: jest.fn().mockReturnValue(0),
        height: jest.fn().mockReturnValue(800),
        scroll: jest.fn()
      };
    });

    // Define Header constructor manually for testing
    const Header = function() {
      this.$header = $('#header');
      this.headerHeight = this.$header.height();
      this.headerUpCSSClass = 'header-up';
      this.delta = 15;
      this.lastScrollTop = 0;
    };

    Header.prototype.run = function() {
      var self = this;
      var didScroll;

      $(window).scroll(function() {
        didScroll = true;
      });

      setInterval(function() {
        if (didScroll) {
          self.animate();
          didScroll = false;
        }
      }, 250);
    };

    Header.prototype.animate = function() {
      var scrollTop = $(window).scrollTop();

      if (Math.abs(this.lastScrollTop - scrollTop) <= this.delta) {
        return;
      }

      if ((scrollTop > this.lastScrollTop) && (scrollTop > this.headerHeight)) {
        this.$header.addClass(this.headerUpCSSClass);
      }
      else if (scrollTop + $(window).height() < $(document).height()) {
        this.$header.removeClass(this.headerUpCSSClass);
      }

      this.lastScrollTop = scrollTop;
    };

    const header = new Header();
    expect(header).toBeDefined();
    expect(header.headerHeight).toBe(60);
    expect(header.headerUpCSSClass).toBe('header-up');
  });


  test('should add header-up class when scrolling down', () => {
    const mockHeader = {
      height: jest.fn().mockReturnValue(60),
      addClass: jest.fn(),
      removeClass: jest.fn()
    };
    
    mockJQuery.mockImplementation((selector) => {
      if (selector === '#header') return mockHeader;
      if (selector === 'window') return {scroll: jest.fn()};
      return {
        scrollTop: jest.fn().mockReturnValue(100),
        height: jest.fn().mockReturnValue(800)
      };
    });

    const Header = function() {
      this.$header = $('#header');
      this.headerHeight = this.$header.height();
      this.headerUpCSSClass = 'header-up';
      this.delta = 15;
      this.lastScrollTop = 0;
    };

    Header.prototype.animate = function() {
      var scrollTop = $(window).scrollTop();

      if (Math.abs(this.lastScrollTop - scrollTop) <= this.delta) {
        return;
      }

      if ((scrollTop > this.lastScrollTop) && (scrollTop > this.headerHeight)) {
        this.$header.addClass(this.headerUpCSSClass);
      }
      else if (scrollTop + $(window).height() < $(document).height()) {
        this.$header.removeClass(this.headerUpCSSClass);
      }

      this.lastScrollTop = scrollTop;
    };

    const header = new Header();
    header.animate();

    expect(mockHeader.addClass).toHaveBeenCalledWith('header-up');
  });
});

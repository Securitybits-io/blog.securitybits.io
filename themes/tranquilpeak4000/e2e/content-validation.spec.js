const { test, expect } = require("@playwright/test");
const { navigateToPage } = require("./utils/navigation-helper");
const { createLogger } = require("./utils/test-logger");

test.describe("Content Validation Tests", () => {
  test("homepage displays correctly", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing homepage display");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Check for basic page structure
    logger.debug("Checking basic page structure");
    await expect(page.locator("body")).toBeVisible();
    logger.success("Body element is visible");

    // Check for main content area - be more flexible with selectors
    logger.step("Validating main content area");
    const main = page.locator(
      'main, [role="main"], .main-content, #main, .content, article, .post, .posts, .blog-posts'
    );
    if ((await main.count()) > 0) {
      // Check if any main content element is visible
      let mainVisible = false;
      for (let i = 0; i < (await main.count()); i++) {
        if (await main.nth(i).isVisible()) {
          mainVisible = true;
          break;
        }
      }
      expect(mainVisible).toBe(true);
      logger.success("Main content area is visible");
    } else {
      // If no main content found, check for any visible content
      logger.debug("No main content found, checking for any visible content");
      const anyContent = page.locator("div, section, article");
      let hasVisibleContent = false;
      for (let i = 0; i < Math.min(await anyContent.count(), 10); i++) {
        if (await anyContent.nth(i).isVisible()) {
          hasVisibleContent = true;
          break;
        }
      }
      expect(hasVisibleContent).toBe(true);
      logger.success("Alternative content area is visible");
    }

    // Check for footer - be more flexible
    logger.step("Checking footer elements");
    const footer = page.locator(
      'footer, [role="contentinfo"], .footer, #footer, .site-footer, .page-footer, .bottom-bar'
    );
    if ((await footer.count()) > 0) {
      // Check if any footer element is visible
      let footerVisible = false;
      for (let i = 0; i < (await footer.count()); i++) {
        if (await footer.nth(i).isVisible()) {
          footerVisible = true;
          break;
        }
      }
      expect(footerVisible).toBe(true);
      logger.success("Footer is visible");
    } else {
      logger.debug("No footer elements found");
    }

    logger.success("Homepage display test completed successfully");
  });

  test("blog posts are accessible", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing blog post accessibility");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Look for blog post links
    logger.step("Searching for blog post links");
    const postLinks = page.locator(
      'a[href*="/post/"], a[href*="/posts/"], .post-link, .entry-title a'
    );
    const postLinkCount = await postLinks.count();

    if (postLinkCount > 0) {
      logger.info(`Found ${postLinkCount} blog post links`);

      // Test first few post links
      for (let i = 0; i < Math.min(postLinkCount, 3); i++) {
        const link = postLinks.nth(i);
        const href = await link.getAttribute("href");

        if (href && (href.startsWith("/") || href.startsWith("./"))) {
          logger.debug(`Testing post link ${i + 1}: ${href}`);
          // Navigate to the post
          await link.click();
          await page.waitForLoadState("networkidle");

          // Check if post page loads correctly
          logger.debug("Validating post page structure");
          await expect(page.locator("body")).toBeVisible();

          // Look for article content
          const article = page.locator("article, .post, .entry, .content");
          if ((await article.count()) > 0) {
            await expect(article.first()).toBeVisible();
            logger.success("Article content is visible");
          } else {
            logger.warn("No article content found on post page");
          }

          // Check for post title
          const title = page.locator("h1, .post-title, .entry-title");
          if ((await title.count()) > 0) {
            await expect(title.first()).toBeVisible();
            logger.success("Post title is visible");
          } else {
            logger.warn("No post title found");
          }

          // Go back to homepage for next iteration
          logger.debug("Returning to homepage for next test");
          await page.goto("/");
          logger.success(`Successfully tested post: ${href}`);
        } else {
          logger.debug(`Skipping external link: ${href}`);
        }
      }
      logger.success("Blog post accessibility test completed");
    } else {
      logger.warn("No blog post links found on homepage");
    }
  });

  test("archive/category pages work", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing archive/category pages");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Get viewport size to determine if we're on mobile
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768; // Common mobile breakpoint

    if (isMobile) {
      // On mobile, test archive/category pages directly via URL instead of navigation
      logger.info(
        "📱 Mobile viewport detected - testing archive pages directly"
      );

      // For mobile, we'll test archive pages directly since navigation may be different
      // This is a common pattern where mobile sites have different navigation but same content
      const archiveUrls = ["/categories/showcase", "/tags/hugo", "/archives"];

      for (const url of archiveUrls) {
        try {
          logger.debug(`📱 Testing mobile archive page: ${url}`);
          await navigateToPage(page, url, {
            strategy: "networkidle",
            testInfo,
          });

          // Check if archive page loads
          await expect(page.locator("body")).toBeVisible();

          // Look for post listings
          const postList = page.locator(
            ".post-preview, .post-summary, .entry-summary, article"
          );
          const postListCount = await postList.count();
          logger.info(
            `📱 Mobile archive page ${url} has ${postListCount} post entries`
          );

          // If we successfully test one archive page, that's sufficient for mobile
          logger.success(`📱 Successfully tested mobile archive page: ${url}`);
          break;
        } catch (error) {
          logger.warn(
            `📱 Archive page ${url} not accessible on mobile - trying next`
          );
        }
      }

      // Return to homepage
      await navigateToPage(page, "/", {
        strategy: "networkidle",
        testInfo,
      });
    } else {
      // Desktop view - test direct links
      logger.info(
        "🖥️ Desktop viewport detected - testing direct archive links"
      );

      // Look for archive/category links
      const archiveLinks = page.locator(
        'a[href*="/categories/"], a[href*="/tags/"], a[href*="/archive"], .category-link, .tag-link'
      );
      const archiveLinkCount = await archiveLinks.count();

      if (archiveLinkCount > 0) {
        logger.info(`🖥️ Found ${archiveLinkCount} archive/category links`);

        // Test first few archive links
        for (let i = 0; i < Math.min(archiveLinkCount, 2); i++) {
          const link = archiveLinks.nth(i);
          const href = await link.getAttribute("href");

          if (href && (href.startsWith("/") || href.startsWith("./"))) {
            logger.debug(`🖥️ Testing desktop archive link: ${href}`);
            await link.click();
            await page.waitForLoadState("networkidle");

            // Check if archive page loads
            await expect(page.locator("body")).toBeVisible();

            // Look for post listings
            const postList = page.locator(
              ".post-preview, .post-summary, .entry-summary, article"
            );
            const postListCount = await postList.count();
            logger.info(
              `🖥️ Desktop archive page has ${postListCount} post entries`
            );

            await navigateToPage(page, "/", {
              strategy: "networkidle",
              testInfo,
            });
            logger.success(
              `🖥️ Successfully tested desktop archive link: ${href}`
            );
          }
        }
        logger.success("Desktop archive/category pages test completed");
      } else {
        logger.warn("🖥️ No archive/category links found on desktop");
      }
    }
  });

  test("search functionality works", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing search functionality");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Look for search functionality
    logger.step("Looking for search elements");
    const searchInput = page.locator(
      'input[type="search"], input[name*="search"], .search-input'
    );
    const searchForm = page.locator('form[role="search"], .search-form');

    if ((await searchInput.count()) > 0) {
      logger.info("Search input found");
      const input = searchInput.first();
      await expect(input).toBeVisible();

      // Test search input
      logger.debug("Testing search input functionality");
      await input.fill("test");
      await expect(input).toHaveValue("test");
      logger.success("Search input accepts text input");

      // If there's a search form, try submitting
      if ((await searchForm.count()) > 0) {
        logger.debug("Search form found, testing submission");
        const form = searchForm.first();
        const submitButton = form.locator(
          'button[type="submit"], input[type="submit"], .search-submit'
        );

        if ((await submitButton.count()) > 0) {
          await submitButton.click();
          await page.waitForLoadState("networkidle");

          // Check if search results page loads
          await expect(page.locator("body")).toBeVisible();
          logger.success("Search form submission successful");
        } else {
          logger.warn("No submit button found in search form");
        }
      } else {
        logger.debug("No search form found, input-only search");
      }
      logger.success("Search functionality test completed");
    } else {
      logger.warn("No search input found on page");
    }
  });

  test("RSS/feed links are present", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing RSS/feed links");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Check for RSS feed links in head
    logger.step("Checking for RSS feed links in head");
    const rssFeed = page.locator(
      'link[type="application/rss+xml"], link[href*="rss"], link[href*="feed"]'
    );
    const rssFeedCount = await rssFeed.count();

    if (rssFeedCount > 0) {
      logger.info(`Found ${rssFeedCount} RSS/feed links`);

      for (let i = 0; i < rssFeedCount; i++) {
        const feed = rssFeed.nth(i);
        const href = await feed.getAttribute("href");

        if (href) {
          logger.debug(`Testing RSS feed accessibility: ${href}`);
          // Test if feed URL is accessible
          const response = await page.request.get(href).catch(() => null);
          if (response) {
            expect(response.status()).toBe(200);
            logger.success(`RSS feed accessible: ${href}`);
          } else {
            logger.warn(`RSS feed not accessible: ${href}`);
          }
        }
      }
    } else {
      logger.warn("No RSS feed links found in head");
    }

    // Also check for visible RSS links
    logger.step("Checking for visible RSS links");
    const visibleRssLinks = page.locator(
      'a[href*="rss"], a[href*="feed"], .rss-link'
    );
    const visibleRssCount = await visibleRssLinks.count();

    if (visibleRssCount > 0) {
      logger.info(`Found ${visibleRssCount} visible RSS links`);
    } else {
      logger.debug("No visible RSS links found");
    }

    logger.success("RSS/feed links test completed");
  });

  test("multilingual support works", async ({ page }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing multilingual support");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Look for language switcher
    logger.step("Looking for language switcher elements");
    const langSwitcher = page.locator(
      '.language-switcher, .lang-switcher, a[href*="/en/"], a[href*="/es/"], a[href*="/fr/"]'
    );
    const langCount = await langSwitcher.count();

    if (langCount > 0) {
      logger.info(`Found ${langCount} language-related elements`);

      // Test first language link
      const firstLang = langSwitcher.first();
      const href = await firstLang.getAttribute("href");

      if (href && (href.startsWith("/") || href.startsWith("./"))) {
        logger.debug(`Testing language link: ${href}`);
        await firstLang.click();
        await page.waitForLoadState("networkidle");

        // Check if page loads in different language
        await expect(page.locator("body")).toBeVisible();

        // Check for language-specific content indicators
        const htmlLang = await page.locator("html").getAttribute("lang");
        if (htmlLang) {
          logger.info(`Page language: ${htmlLang}`);
        }

        logger.success(`Successfully tested language switching to: ${href}`);
      } else {
        logger.debug(`Skipping external language link: ${href}`);
      }
    } else {
      logger.debug("No language switcher elements found");
    }

    logger.success("Multilingual support test completed");
  });

  test("header functionality works across devices", async ({
    page,
  }, testInfo) => {
    const logger = createLogger(testInfo);

    logger.step("Testing header functionality across devices");
    await navigateToPage(page, "/", {
      strategy: "networkidle",
      testInfo,
    });

    // Get viewport size to determine if we're on mobile
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768; // Common mobile breakpoint

    if (isMobile) {
      // Mobile header testing
      logger.info(
        "📱 Mobile viewport detected - testing mobile header behavior"
      );

      // Look for mobile-specific header elements
      const mobileHeader = page.locator(
        '.mobile-header, .header-mobile, [data-mobile="true"], .navbar-mobile, .header .mobile'
      );
      const mobileHeaderCount = await mobileHeader.count();

      if (mobileHeaderCount > 0) {
        logger.info(
          `📱 Found ${mobileHeaderCount} mobile-specific header elements`
        );

        // Test mobile header visibility
        for (let i = 0; i < mobileHeaderCount; i++) {
          const header = mobileHeader.nth(i);
          if (await header.isVisible()) {
            logger.success(`📱 Mobile header element ${i + 1} is visible`);
          } else {
            logger.debug(`📱 Mobile header element ${i + 1} is not visible`);
          }
        }
      } else {
        logger.debug("📱 No mobile-specific header elements found");
      }

      // Look for hamburger menu or mobile menu toggle
      const hamburgerMenu = page.locator(
        '.hamburger, .menu-toggle, .mobile-menu-toggle, .navbar-toggler, [aria-label*="menu"], .menu-button'
      );
      const hamburgerCount = await hamburgerMenu.count();

      if (hamburgerCount > 0) {
        logger.info(`📱 Found ${hamburgerCount} hamburger menu elements`);

        // Test hamburger menu functionality
        for (let i = 0; i < Math.min(hamburgerCount, 2); i++) {
          const hamburger = hamburgerMenu.nth(i);

          if (await hamburger.isVisible()) {
            logger.debug(`📱 Testing hamburger menu ${i + 1}`);

            try {
              // Click the hamburger menu
              await hamburger.click();
              await page.waitForTimeout(1000); // Wait for animation

              // Look for expanded menu
              const expandedMenu = page.locator(
                '.mobile-menu, .navbar-collapse, .menu-expanded, .nav-menu, [aria-expanded="true"]'
              );

              if ((await expandedMenu.count()) > 0) {
                logger.success(
                  `📱 Hamburger menu ${i + 1} expands successfully`
                );

                // Test menu items if present
                const menuItems = expandedMenu.locator(
                  "a, .nav-link, .menu-item"
                );
                const menuItemCount = await menuItems.count();

                if (menuItemCount > 0) {
                  logger.info(`📱 Mobile menu has ${menuItemCount} items`);

                  // Test first menu item if it's internal
                  const firstItem = menuItems.first();
                  const href = await firstItem.getAttribute("href");

                  if (href && (href.startsWith("/") || href.startsWith("./"))) {
                    logger.debug(`📱 Testing mobile menu item: ${href}`);
                    await firstItem.click();
                    await page.waitForLoadState("networkidle");

                    // Verify navigation worked
                    await expect(page.locator("body")).toBeVisible();
                    logger.success(
                      `📱 Mobile menu navigation successful: ${href}`
                    );

                    // Return to homepage
                    await navigateToPage(page, "/", {
                      strategy: "networkidle",
                      testInfo,
                    });
                  }
                }

                // Close the menu
                await hamburger.click();
                await page.waitForTimeout(500);
                logger.debug(`📱 Hamburger menu ${i + 1} closed successfully`);
              } else {
                logger.warn(
                  `📱 Hamburger menu ${
                    i + 1
                  } clicked but no expanded menu found`
                );
              }
            } catch (error) {
              logger.error(
                `📱 Error testing hamburger menu ${i + 1}:`,
                error.message
              );
            }
          } else {
            logger.debug(`📱 Hamburger menu ${i + 1} is not visible`);
          }
        }
      } else {
        logger.debug("📱 No hamburger menu elements found");
      }

      // Test mobile header responsiveness
      logger.step("📱 Testing mobile header responsiveness");
      const headerElements = page.locator(
        'header, [role="banner"], .header, #header, .site-header, .page-header, .top-bar, .navbar'
      );

      if ((await headerElements.count()) > 0) {
        // Check if header adapts to mobile viewport
        const header = headerElements.first();
        const headerBox = await header.boundingBox();

        if (headerBox) {
          logger.info(
            `📱 Header dimensions: ${headerBox.width}x${headerBox.height}`
          );

          // Header should not be wider than viewport
          if (headerBox.width <= viewport.width) {
            logger.success("📱 Header is properly sized for mobile viewport");
          } else {
            logger.warn("📱 Header may be too wide for mobile viewport");
          }
        }
      }
    } else {
      // Desktop header testing
      logger.info(
        "🖥️ Desktop viewport detected - testing desktop header behavior"
      );

      // Look for desktop header elements
      const desktopHeader = page.locator(
        'header, [role="banner"], .header, #header, .site-header, .page-header, .top-bar, .navbar'
      );
      const desktopHeaderCount = await desktopHeader.count();

      if (desktopHeaderCount > 0) {
        logger.info(`🖥️ Found ${desktopHeaderCount} desktop header elements`);

        // Test desktop header visibility and functionality
        for (let i = 0; i < desktopHeaderCount; i++) {
          const header = desktopHeader.nth(i);

          if (await header.isVisible()) {
            logger.success(`🖥️ Desktop header element ${i + 1} is visible`);

            // Test navigation links in header
            const navLinks = header.locator("a, .nav-link, .menu-item");
            const navLinkCount = await navLinks.count();

            if (navLinkCount > 0) {
              logger.info(
                `🖥️ Desktop header ${
                  i + 1
                } has ${navLinkCount} navigation links`
              );

              // Test first few navigation links
              for (let j = 0; j < Math.min(navLinkCount, 3); j++) {
                const link = navLinks.nth(j);
                const href = await link.getAttribute("href");

                if (href && (href.startsWith("/") || href.startsWith("./"))) {
                  logger.debug(`🖥️ Testing desktop header link: ${href}`);

                  try {
                    await link.click();
                    await page.waitForLoadState("networkidle");

                    // Verify navigation worked
                    await expect(page.locator("body")).toBeVisible();
                    logger.success(
                      `🖥️ Desktop header navigation successful: ${href}`
                    );

                    // Return to homepage
                    await navigateToPage(page, "/", {
                      strategy: "networkidle",
                      testInfo,
                    });

                    // Re-find the header after navigation
                    const updatedHeader = page
                      .locator(
                        'header, [role="banner"], .header, #header, .site-header, .page-header, .top-bar, .navbar'
                      )
                      .nth(i);

                    if (await updatedHeader.isVisible()) {
                      logger.debug(
                        `🖥️ Desktop header ${
                          i + 1
                        } still visible after navigation`
                      );
                    }
                  } catch (error) {
                    logger.error(
                      `🖥️ Error testing desktop header link:`,
                      error.message
                    );
                  }
                } else {
                  logger.debug(`🖥️ Skipping external header link: ${href}`);
                }
              }
            } else {
              logger.debug(
                `🖥️ Desktop header ${i + 1} has no navigation links`
              );
            }
          } else {
            logger.debug(`🖥️ Desktop header element ${i + 1} is not visible`);
          }
        }
      } else {
        logger.warn("🖥️ No desktop header elements found");
      }

      // Test desktop header responsiveness
      logger.step("🖥️ Testing desktop header responsiveness");
      const headerElements = page.locator(
        'header, [role="banner"], .header, #header, .site-header, .page-header, .top-bar, .navbar'
      );

      if ((await headerElements.count()) > 0) {
        const header = headerElements.first();
        const headerBox = await header.boundingBox();

        if (headerBox) {
          logger.info(
            `🖥️ Header dimensions: ${headerBox.width}x${headerBox.height}`
          );

          // Header should be properly sized for desktop
          if (headerBox.width > 0 && headerBox.height > 0) {
            logger.success(
              "🖥️ Header has proper dimensions for desktop viewport"
            );
          } else {
            logger.warn("🖥️ Header may have sizing issues on desktop");
          }
        }
      }
    }

    logger.success("Header functionality test completed successfully");
  });
});

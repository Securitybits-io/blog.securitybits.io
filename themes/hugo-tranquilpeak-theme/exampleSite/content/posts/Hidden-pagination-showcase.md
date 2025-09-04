---
title: "Hidden pagination showcase"
date: 2014-08-24T22:40:32.169Z
description: "This article demonstrates the pagination features of the Tranquilpeak theme"
thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
categories: ["showcase"]
tags: ["pagination", "navigation", "features"]
photos:
  - "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
  - "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
---

This article demonstrates the pagination features of the Tranquilpeak theme. Pagination helps organize content and improve navigation for readers.

## What is pagination?

Pagination is a navigation feature that divides content into multiple pages. This is especially useful for:

- **Blog archives**: When you have many posts
- **Category pages**: When a category has many articles
- **Tag pages**: When a tag has many related posts
- **Search results**: When search returns many results

## How pagination works

The Tranquilpeak theme automatically handles pagination for:

1. **Home page**: Shows recent posts with pagination
2. **Category pages**: Shows posts in a category with pagination
3. **Tag pages**: Shows posts with a specific tag with pagination
4. **Archive pages**: Shows all posts organized by date with pagination

## Pagination configuration

You can configure pagination in your `config.toml` file:

```toml
[pagination]
  pagerSize = 7
```

The `pagerSize` parameter controls how many posts are shown per page.

## Pagination controls

The theme provides several pagination controls:

### Previous/Next buttons

At the bottom of each page, you'll find:
- **Previous**: Link to the previous page
- **Next**: Link to the next page

### Page numbers

For pages with many posts, you'll see:
- Page numbers (1, 2, 3, etc.)
- Current page highlighted
- Ellipsis (...) for large page ranges

### First/Last buttons

For very long lists:
- **First**: Jump to the first page
- **Last**: Jump to the last page

## Responsive pagination

The pagination controls are fully responsive:

- **Desktop**: Full pagination with page numbers
- **Tablet**: Simplified pagination with Previous/Next
- **Mobile**: Touch-friendly pagination controls

## Customizing pagination

You can customize the pagination appearance by modifying the theme's CSS:

```css
/* Custom pagination styles */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
}

.pagination a {
    padding: 0.5rem 1rem;
    margin: 0 0.25rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    text-decoration: none;
    color: #333;
}

.pagination a:hover {
    background-color: #f8f9fa;
}

.pagination .current {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
}
```

## Best practices

1. **Choose appropriate page size**: Not too small (frequent pagination) or too large (slow loading)
2. **Test on mobile**: Ensure pagination works well on small screens
3. **Provide clear navigation**: Make it easy for users to find content
4. **Consider SEO**: Pagination can help with search engine optimization
5. **Monitor performance**: Large page sizes can slow down loading

## SEO considerations

Pagination can impact SEO in several ways:

- **Duplicate content**: Multiple pages with similar content
- **Link equity**: Splitting link value across multiple pages
- **Crawl efficiency**: Search engines need to crawl multiple pages

### SEO best practices

1. **Use canonical URLs**: Point to the first page for duplicate content
2. **Implement rel="prev" and rel="next"**: Help search engines understand pagination
3. **Create a sitemap**: Include all paginated pages in your sitemap
4. **Optimize page titles**: Use descriptive titles for each page

## Example pagination structure

Here's how pagination typically looks:

```
Page 1: Posts 1-7
Page 2: Posts 8-14
Page 3: Posts 15-21
...
```

## Testing pagination

To test pagination features:

1. **Create many posts**: Add enough content to trigger pagination
2. **Check different pages**: Visit page 1, 2, 3, etc.
3. **Test navigation**: Use Previous/Next buttons
4. **Verify mobile**: Test on mobile devices
5. **Check URLs**: Ensure URLs are correct (e.g., `/page/2/`)

## Conclusion

Pagination is an essential feature for blogs with lots of content. The Tranquilpeak theme provides a clean, responsive pagination system that helps readers navigate your content efficiently.

## Tips for content creators

1. **Plan your content**: Consider how pagination will affect your content strategy
2. **Use categories and tags**: Help readers find related content
3. **Create compelling first pages**: Make the first page of each section engaging
4. **Monitor analytics**: Track how users navigate through paginated content
5. **Optimize for speed**: Ensure paginated pages load quickly

Pagination helps create a better user experience and makes your blog more organized and professional. 
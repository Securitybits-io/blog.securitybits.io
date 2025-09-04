---
title: "Video integrations showcase"
date: 2014-08-24T22:40:32.169Z
description: "This article demonstrates the video integration features of the Tranquilpeak theme"
thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
categories: ["showcase"]
tags: ["videos-integration", "youtube", "vimeo", "dailymotion"]
photos:
  - "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
  - "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
---

This article demonstrates the video integration features of the Tranquilpeak theme. You can easily embed videos from various platforms using shortcodes.

## YouTube videos

YouTube is the most popular video platform. You can embed videos using the YouTube shortcode:

{{% youtube "dQw4w9WgXcQ" %}}

### YouTube with custom title

{{% youtube "dQw4w9WgXcQ" "Rick Astley - Never Gonna Give You Up" %}}

## Vimeo videos

Vimeo is popular among creators for its high-quality videos:

{{% vimeo "76979871" %}}

### Vimeo with custom title

{{% vimeo "76979871" "Beautiful Mountain Landscape" %}}

## Dailymotion videos

Dailymotion is another popular video platform:

{{% dailymotion "x8c19s" %}}

### Dailymotion with custom title

{{% dailymotion "x8c19s" "Amazing Nature Video" %}}

## How to use video shortcodes

### YouTube

```markdown
{{% youtube "VIDEO_ID" %}}
{{% youtube "VIDEO_ID" "Custom Title" %}}
```

### Vimeo

```markdown
{{% vimeo "VIDEO_ID" %}}
{{% vimeo "VIDEO_ID" "Custom Title" %}}
```

### Dailymotion

```markdown
{{% dailymotion "VIDEO_ID" %}}
{{% dailymotion "VIDEO_ID" "Custom Title" %}}
```

## Finding video IDs

### YouTube
The video ID is the part after `v=` in the URL:
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ID: `dQw4w9WgXcQ`

### Vimeo
The video ID is the number in the URL:
- URL: `https://vimeo.com/76979871`
- ID: `76979871`

### Dailymotion
The video ID is the part after the last `/`:
- URL: `https://www.dailymotion.com/video/x8c19s`
- ID: `x8c19s`

## Responsive design

All embedded videos are fully responsive and will look great on all devices:

- **Desktop**: Full-width display with optimal quality
- **Tablet**: Scaled appropriately for medium screens
- **Mobile**: Optimized for small screens with touch-friendly controls

## Best practices

1. **Choose relevant videos**: Select videos that relate to your content
2. **Use custom titles**: Add descriptive titles to improve accessibility
3. **Consider loading times**: Videos can slow down page loading
4. **Test on mobile**: Ensure videos work well on mobile devices
5. **Respect copyright**: Only embed videos you have permission to use

## Technical details

The video shortcodes use the following technologies:

- **YouTube**: YouTube Embed API
- **Vimeo**: Vimeo Player API
- **Dailymotion**: Dailymotion Player API

All videos are embedded using iframes with responsive CSS to ensure they scale properly on all devices.

## More examples

### Educational content

{{% youtube "kJQP7kiw5Fk" "Luis Fonsi - Despacito ft. Daddy Yankee" %}}

### Nature videos

{{% vimeo "76979871" "Beautiful Mountain Landscape" %}}

### Technology videos

{{% dailymotion "x8c19s" "Technology Showcase" %}}

## Conclusion

The Tranquilpeak theme makes it easy to embed videos from popular platforms. The shortcodes are simple to use and provide a consistent, responsive experience across all devices.

## Usage tips

1. **Keep it relevant**: Only embed videos that add value to your content
2. **Use descriptive titles**: Help readers understand what the video contains
3. **Consider performance**: Too many videos can slow down your site
4. **Test thoroughly**: Ensure videos work on all target devices
5. **Follow platform guidelines**: Respect the terms of service for each platform

Video integration is a great way to make your blog posts more engaging and informative. 
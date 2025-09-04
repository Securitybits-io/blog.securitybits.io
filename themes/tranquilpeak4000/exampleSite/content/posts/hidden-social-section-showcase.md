---
title: "Hidden social section showcase"
date: 2014-08-24T22:40:32.169Z
description: "This article demonstrates the social media integration features of the Tranquilpeak theme"
thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
categories: ["showcase"]
tags: ["social", "social-media", "sharing"]
photos:
  - "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
  - "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
---

This article demonstrates the social media integration features of the Tranquilpeak theme. The theme includes comprehensive social media support for sharing content and connecting with readers.

## Social sharing buttons

The theme includes social sharing buttons that allow readers to easily share your content on various platforms:

### Available platforms

- **Facebook**: Share posts on Facebook
- **Twitter**: Share posts on Twitter/X
- **LinkedIn**: Share posts on LinkedIn
- **Reddit**: Share posts on Reddit
- **Pinterest**: Pin images to Pinterest
- **WhatsApp**: Share via WhatsApp
- **Email**: Share via email

### How sharing works

When readers click on a social sharing button:

1. **Opens sharing dialog**: The platform's sharing dialog opens
2. **Pre-filled content**: Title and URL are automatically included
3. **Customizable**: You can customize the sharing text
4. **Analytics**: Track sharing activity (if configured)

## Social media profiles

The theme supports linking to your social media profiles in the sidebar:

### Supported platforms

- **GitHub**: Link to your GitHub profile
- **Twitter**: Link to your Twitter/X profile
- **LinkedIn**: Link to your LinkedIn profile
- **Facebook**: Link to your Facebook page
- **Instagram**: Link to your Instagram profile
- **YouTube**: Link to your YouTube channel
- **Twitch**: Link to your Twitch channel
- **Discord**: Link to your Discord server
- **Stack Overflow**: Link to your Stack Overflow profile

### Configuration

You can configure social media links in your `config.toml`:

```toml
[[menu.links]]
  weight = 1
  identifier = "github"
  name = "GitHub"
  pre = "<i class=\"sidebar-button-icon fab fa-lg fa-github\" aria-hidden=\"true\"></i>"
  url = "https://github.com/yourusername"

[[menu.links]]
  weight = 2
  identifier = "twitter"
  name = "Twitter"
  pre = "<i class=\"sidebar-button-icon fab fa-lg fa-twitter\" aria-hidden=\"true\"></i>"
  url = "https://twitter.com/yourusername"
```

## Social media meta tags

The theme automatically generates social media meta tags for better sharing:

### Open Graph tags

```html
<meta property="og:title" content="Your Post Title">
<meta property="og:description" content="Your post description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/post/">
<meta property="og:type" content="article">
```

### Twitter Card tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourusername">
<meta name="twitter:title" content="Your Post Title">
<meta name="twitter:description" content="Your post description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

## Social media analytics

You can integrate social media analytics to track sharing activity:

### Facebook Insights

```toml
[params]
  fbAppId = "your-facebook-app-id"
  fbAdminIds = "your-facebook-user-id"
```

### Twitter Analytics

Twitter analytics are available through Twitter's built-in analytics dashboard.

## Social media best practices

### Content optimization

1. **Use engaging titles**: Create titles that encourage sharing
2. **Include images**: Posts with images get more shares
3. **Write compelling descriptions**: Make your content sound interesting
4. **Use hashtags**: Include relevant hashtags for discoverability
5. **Time your posts**: Share when your audience is most active

### Platform-specific tips

#### Facebook
- Use engaging images (1200x630px recommended)
- Write compelling descriptions
- Encourage engagement with questions
- Use Facebook Live for real-time content

#### Twitter/X
- Keep tweets concise (under 280 characters)
- Use relevant hashtags
- Include images or videos
- Engage with your audience

#### LinkedIn
- Write professional, informative content
- Use industry-specific hashtags
- Share insights and expertise
- Network with other professionals

#### Instagram
- Use high-quality images
- Write engaging captions
- Use relevant hashtags
- Post consistently

## Social media integration examples

### Sharing buttons in action

The sharing buttons appear at the bottom of each blog post, making it easy for readers to share your content.

### Social profile links

Your social media profiles are displayed in the sidebar, helping readers connect with you on their preferred platforms.

### Social media feeds

You can also integrate social media feeds to show your latest posts from various platforms.

## Customizing social features

### Custom sharing text

You can customize the sharing text for each platform:

```toml
[params.sharingOptions]
  [[params.sharingOptions]]
    name = "Twitter"
    icon = "fab fa-twitter"
    url = "https://twitter.com/intent/tweet?text=%s&url=%s"
```

### Custom social icons

You can use custom icons for social media links:

```toml
[[menu.links]]
  weight = 1
  identifier = "custom"
  name = "Custom Platform"
  pre = "<i class=\"sidebar-button-icon fas fa-lg fa-custom\" aria-hidden=\"true\"></i>"
  url = "https://customplatform.com/yourprofile"
```

## Social media strategy

### Building your audience

1. **Consistent posting**: Post regularly to maintain engagement
2. **Quality content**: Focus on creating valuable, shareable content
3. **Engagement**: Respond to comments and messages
4. **Cross-promotion**: Share content across multiple platforms
5. **Collaboration**: Work with other creators in your niche

### Measuring success

Track these metrics to measure your social media success:

- **Shares**: How often your content is shared
- **Likes**: Engagement with your content
- **Comments**: Reader interaction
- **Followers**: Growth of your audience
- **Click-through rate**: Traffic from social media

## Conclusion

Social media integration is essential for modern blogging. The Tranquilpeak theme provides comprehensive social media features that help you connect with your audience and grow your blog's reach.

## Tips for success

1. **Be authentic**: Share genuine content that reflects your values
2. **Engage actively**: Respond to comments and messages
3. **Experiment**: Try different types of content and posting times
4. **Analyze results**: Use analytics to understand what works
5. **Stay consistent**: Maintain a regular posting schedule

Social media can significantly increase your blog's visibility and help you build a loyal audience. 
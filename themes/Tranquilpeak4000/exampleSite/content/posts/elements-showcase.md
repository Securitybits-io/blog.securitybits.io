---
title: "Elements showcase"
date: 2015-05-28T22:40:32.169Z
description: "Check out this article to see how the tranquilpeak theme display common HTML elements"
thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
categories: ["showcase"]
tags: ["html-elements", "markdown", "css", "typography"]
photos:
  - "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
  - "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop"
---

Check out this article to see how the tranquilpeak theme display common HTML elements, typography, and other features.

## Typography

### Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Paragraphs

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in sem ut eros viverra sodales. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent dictum, **erat sed facilisis tempor**, nisi nunc luctus dui, sed dictum neque sapien ut leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed in erat nec leo scelerisque blandit.

*Italic text* and **bold text** and `inline code`.

### Blockquotes

> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in sem ut eros viverra sodales. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

### Lists

#### Unordered list

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3

#### Ordered list

1. First item
2. Second item
3. Third item

### Code blocks

#### Inline code

Use `console.log('Hello World!')` to print to the console.

#### Code block with syntax highlighting

```javascript
// This is a sample code block
function hello() {
    console.log("Hello, Tranquilpeak!");
    return "Welcome to the beautiful theme";
}

// More complex example
class Example {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return `Hello, ${this.name}!`;
    }
}
```

```python
def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Example usage
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

```css
/* CSS example */
.sidebar {
    background: rgba(17, 26, 35, 0.95);
    color: #ebebeb;
    width: 250px;
    transition: all 0.3s ease;
}

.sidebar:hover {
    background: rgba(17, 26, 35, 1);
}
```

### Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Responsive Design | Works on all devices | ✅ |
| Code Highlighting | Syntax highlighting for code blocks | ✅ |
| Image Galleries | Beautiful image galleries | ✅ |
| Social Sharing | Share posts on social media | ✅ |
| Comments | Disqus integration | ✅ |

### Links

[Visit the Tranquilpeak theme](https://github.com/kakawait/hugo-tranquilpeak-theme)

### Images

![Sample Image](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop)

### Horizontal rules

---

## Alerts

{{% alert info %}}
This is an info alert with a [link](https://github.com/kakawait/hugo-tranquilpeak-theme).
{{% /alert %}}

{{% alert success %}}
This is a success alert.
{{% /alert %}}

{{% alert warning %}}
This is a warning alert.
{{% /alert %}}

{{% alert danger %}}
This is a danger alert.
{{% /alert %}}

## Mathematical expressions

Inline math: $E = mc^2$

Block math:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Task lists

- [x] Create showcase post
- [x] Add code examples
- [x] Include images
- [ ] Add more features
- [ ] Test all elements

## Definition lists

Term 1
: Definition 1

Term 2
: Definition 2

## Abbreviations

<abbr title="HyperText Markup Language">HTML</abbr> is the standard markup language for creating web pages.

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Conclusion

This showcase demonstrates the beautiful typography and styling of the Tranquilpeak theme. All HTML elements are properly styled and the theme provides excellent readability and visual appeal. 
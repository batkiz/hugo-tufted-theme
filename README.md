# Hugo Tufted Theme

原始版本是 [Typst 版 `Tufted-Blog-Template`](https://github.com/Yousa-Mirage/Tufted-Blog-Template) ，使用 codex 迁移为 hugo 主题。

- Tufte 风格的宽边栏阅读布局
- 纸张质感的极简排版
- 深浅色模式切换
- 博客列表按年份归档
- 适合博客、文档、个人主页的统一壳层


## 本地预览

先进入主题目录，再运行：

```bash
cd hugo-tufted-theme
hugo server --source exampleSite --themesDir ../..
```

如果你想在自己的 Hugo 站点中使用：

1. 把 `hugo-tufted-theme` 放到你的 Hugo 项目的 `themes/` 目录中。
2. 在站点配置里设置：

```toml
theme = "hugo-tufted-theme"
```

3. 参考 `exampleSite/hugo.toml` 配置菜单和主题参数。

## 主题参数

```toml
[params]
  description = "A calm, content-first Hugo site."
  author = "Your Name"
  dateFormat = "2006-01-02"
  mainSections = ["blog"]
  recentPostsCount = 5
  showReadingTime = true
  showThemeToggle = true
  headerElements = ["你好，欢迎来到这里。"]
  footerElements = ["© 2026 Your Name", "Powered by Hugo"]

  [params.options]
    showDarkMode = true
    enableImgZooming = true

  [params.images]
    quality = 82
    maxWidth = 2400
    responsiveWidths = [480, 768, 1200, 1600]

  [params.analytics.cloudflare]
    enable = true
    token = "your-cloudflare-web-analytics-token"

  [params.analytics.umami]
    enable = false
    website_id = "your-website-id"
    url = "https://analytics.example.com/script.js"

  [params.comments.giscus]
    enable = true
    repo = "owner/repository"
    repo_id = "repository-id"
    category = "Comments"
    category_id = "category-id"
    mapping = "pathname"
    position = "bottom"
    lang = "zh-CN"
```

单篇文章可通过 front matter 中的 `math = true` 或 `katex = true` 启用 KaTeX。
评论区还兼容 `[params.comments.utterances]` 配置。

Markdown 图片使用 Page Bundle 中的本地图片时，主题会自动生成 WebP 和响应式 `srcset`；
`params.images` 可以调整输出质量、最大宽度和候选宽度。GIF、SVG、外链图片以及不在
Page Bundle 中的图片会保留原始地址。图片标题 `fullwidth`、`wide`、`gallery` 用于选择
布局，其他标题会显示为图注。

## 内容建议

- 首页使用 `content/_index.md`
- 博客列表使用 `content/blog/_index.md`
- 博客文章放在 `content/blog/*.md`
- 文档页和个人页可以继续按 section 组织

## 可用 shortcodes

- `{{< marginnote >}}...{{< /marginnote >}}`
- `{{< sidenote label="1" >}}...{{< /sidenote >}}`
- `{{< fullwidth >}}...{{< /fullwidth >}}`
- `{{< figure src="/images/demo.webp" alt="demo" caption="说明文字" >}}`

## 说明

这个主题复用了原模板中的一部分样式变量和交互脚本，并针对 Hugo 的默认 HTML 结构重新实现了页面模板与版式。

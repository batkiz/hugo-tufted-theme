# Hugo Tufted Theme

这是一个从当前 Typst 版 `Tufted-Blog-Template` 提炼出来的 Hugo 主题，目标是保留原模板的这些特点：

- Tufte 风格的宽边栏阅读布局
- 纸张质感的极简排版
- 深浅色模式切换
- 博客列表按年份归档
- 适合博客、文档、个人主页的统一壳层

## 目录说明

```text
hugo-tufted-theme/
├── archetypes/         # 新建内容时的 front matter 模板
├── assets/             # CSS 和 JS
├── exampleSite/        # 可直接运行的示例站点
├── layouts/            # Hugo 模板与 shortcodes
└── theme.toml
```

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
```

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

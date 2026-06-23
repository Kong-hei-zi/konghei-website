# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Konghei 个人网站，纯 HTML/CSS/JS，GitHub Pages 部署（push = 上线）。

- 线上：https://konghei.cn
- 本地：`python server.py` → http://localhost:8765

## 常用命令

```bash
python server.py              # 本地开发服务器（静态文件 + /publish 接口）
git add . && git commit -m "" && git push  # 上线
```

## 架构

### 页面

| 页面 | 说明 |
|------|------|
| index.html | 首页橱窗：霓虹城市 CSS 背景 + 四个入口卡片 + 访客系统 |
| blog.html | 博客：双栏布局(文章列表+侧栏)，赛博朋克背景，Markdown 编辑发布 |
| portfolio.html | 作品集：展示柜网格 |
| shop.html | 小店：商品卡片 |
| notes.html | 学习笔记：文件夹知识库 |
| style.css | 全局样式：CSS 变量 + 卡片 + 动画系统 |
| script.js | 首页渲染逻辑 |
| server.py | 本地服务器：静态文件 + POST /publish 写 /posts/ |

### 博客数据流

```
/posts/index.json          ← 文章元数据列表（不含正文）
/posts/{id}.md             ← 每篇文章正文

blog.html 加载：
  fetch index.json → 渲染列表
  fetch {id}.md → 渲染详情（marked.js 解析 Markdown）

本地编辑：
  编辑器(localStorage) → [发布] → POST /publish
  server.py 收到 → 写入 /posts/*.md + 更新 index.json
  git push → 线上同步
```

- localStorage key：`konghei_user_blog`（本地草稿）、`konghei_blog_del`（已删除黑名单）
- 线上只读 /posts/ 静态文件，无编辑 UI
- 编辑功能仅 localhost 激活，密码 `konghei2026`

### 博客页面技术要点

- **markdown 渲染**：marked.js CDN，兼容纯 HTML（透传）
- **标签筛选**：列表上方按钮 + 侧栏标签云，双向联动
- **详情页**：header 折叠隐藏 + 上一篇/下一篇导航 + 阅读时间
- **发布**：全量替换 /posts/，自动清理已删除文章的 .md 文件
- **删除黑名单**：点 X 删文章后 localStorage 记录 ID，刷新不复现

### 设计

- 配色：紫 `#a78bfa` / 粉 `#e879f9` / 青 `#22d3ee` / 琥珀 `#fbbf24`，深底 `#06060e`
- 博客背景：CSS 多层赛博朋克（光晕/透视网格/粒子/光环/电路线/扫描线）
- 卡片：亚克力玻璃 `backdrop-filter: blur(14px)`，霓虹边框 hover 发光
- 侧栏：标签云 + 精选文章，sticky 定位，看详情时隐藏
- 顶栏：中英双语标签 + 玻璃质感

## 注意事项

- content.js 不再存博客数据，只存 portfolio/shop/notes 静态内容
- push 即部署，无构建步骤
- 音乐 FLAC 25MB，本地可用

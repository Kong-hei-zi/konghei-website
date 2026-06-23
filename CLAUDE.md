# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Konghei 个人网站，纯 HTML/CSS/JS，GitHub Pages 部署（push = 上线）。

- 线上：https://konghei.cn
- 本地：`python server.py` → http://localhost:8765

## 常用命令

```bash
python server.py              # 本地开发服务器（静态文件 + /publish + /portfolio-publish）
git add . && git commit -m "" && git push  # 上线
```

## 架构

### 页面

| 页面 | 说明 |
|------|------|
| index.html | 首页橱窗：霓虹城市 CSS 背景 + 四个入口卡片 + 访客系统 |
| blog.html | 博客：双栏布局(文章列表+侧栏)，赛博朋克背景，Markdown 编辑发布 |
| portfolio.html | 作品集：暗色展厅主题（聚光灯+浮尘+地面反射），在线编辑发布 |
| shop.html | 小店：商品卡片 |
| notes.html | 学习笔记：文件夹知识库 |
| style.css | 全局样式：CSS 变量 + 卡片 + 动画系统 |
| script.js | 首页渲染逻辑 |
| server.py | 本地服务器：静态文件 + POST /publish + POST /portfolio-publish |

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

### 作品集数据流

```
/projects/index.json       ← 项目元数据（含图片路径）
/projects/{id}/thumb.png   ← 封面截图
/projects/{id}/shot-N.png  ← 详情页轮播图

portfolio.html 加载：
  fetch index.json → 渲染卡片网格
  点击卡片 → 详情页（截图轮播 + GitHub/Demo 链接）

本地编辑：
  +号弹窗 → 填表+拖图(base64)→ 保存到 localStorage → [⬆发布] → POST /portfolio-publish
  server.py 收到 → 解码 base64 写 PNG → 检测磁盘已有图片 → 更新 index.json
  git push → 线上同步
```

- localStorage key：`konghei_user_portfolio`（本地草稿，优先覆盖服务器数据）
- 认证：密码 `konghei2026`，sessionStorage key `konghei_pf_auth`
- 图片上传：点击虚线框（JS 触发隐藏 input）或拖拽到虚线框（追加模式）
- 编辑器含封面截图（单张）+ 更多截图轮播（多张，拖拽累加）+ HTML 正文

### 博客页面技术要点

- **markdown 渲染**：marked.js CDN，兼容纯 HTML（透传）
- **标签筛选**：列表上方按钮 + 侧栏标签云，双向联动
- **详情页**：header 折叠隐藏 + 上一篇/下一篇导航 + 阅读时间
- **发布**：全量替换 /posts/，自动清理已删除文章的 .md 文件
- **删除黑名单**：点 X 删文章后 localStorage 记录 ID，刷新不复现

### 作品集页面技术要点

- **暗色展厅主题**：聚光灯(spotlightBreath动画)+浮尘(dustFloat动画)+地面反射+展台线，与博客赛博朋克视觉区分
- **琥珀/奶油色调**：`#fbbf24` / `#d4c8b0`，区别于博客的紫/粉/青霓虹色
- **标签筛选**：ALL | HTML/CSS | Python | Web开发，按钮组
- **详情页**：header + filters 同时折叠，返回展厅恢复
- **图片显示**：发布前用 base64（_thumbData/_shotDataList），发布后用文件路径（image/screenshots）
- **发布**：server.py 三层保障 —— 新图片覆盖 → 旧 index.json 保留 → 磁盘文件检测兜底

### 设计

- 配色：紫 `#a78bfa` / 粉 `#e879f9` / 青 `#22d3ee` / 琥珀 `#fbbf24`，深底 `#06060e`
- 博客背景：CSS 多层赛博朋克（光晕/透视网格/粒子/光环/电路线/扫描线）
- 作品集背景：CSS 展厅聚光灯（顶部投射+地面反射+浮尘）
- 卡片：亚克力玻璃 `backdrop-filter: blur(14px)`，霓虹边框 hover 发光
- 侧栏：标签云 + 精选文章，sticky 定位，看详情时隐藏
- 顶栏：中英双语标签 + 玻璃质感

## 注意事项

- content.js 不再存博客和作品集数据，只存 shop/notes 静态内容
- push 即部署，无构建步骤
- 音乐 FLAC 25MB，本地可用
- 服务器端口 8765，多进程累积会导致端口冲突，需 taskkill 清理

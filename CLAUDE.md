# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Konghei 的个人静态网站，纯 HTML/CSS/JS，单页面五板块（首页/博客/作品集/小店/学习笔记）。

## 常用命令

```bash
# 本地预览：直接双击 index.html 在浏览器打开，无需服务器
# 推送上线
git add . && git commit -m "描述改了什么" && git push
```

## 部署架构

- 代码托管：GitHub `Kong-hei-zi/konghei-website`
- 静态托管：GitHub Pages（master 分支自动部署）
- 自定义域名：`konghei.cn`（腾讯云 DNS → GitHub Pages A 记录）
- DNS 记录：`@` A → `185.199.108.153` + `185.199.109.153`；`www` CNAME → `kong-hei-zi.github.io`

## 文件结构

| 文件 | 作用 |
|------|------|
| index.html | 主页面，侧边导航 + 五个 section 板块 |
| style.css | 深色主题，侧边栏布局，卡片组件，响应式 |
| script.js | 导航按钮切换板块（classList toggle active） |

## 注意事项

- 修改后 `git push` 即自动部署，无需构建步骤
- 更换域名只需改 DNS 记录，代码不用动
- 当前是展示型页面，无后端、无数据库

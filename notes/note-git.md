## Git 核心概念

Git 是一个**分布式版本控制系统**，它记录的是文件的快照而非差异。

### 三个区域

```
工作区 (Working)  →  暂存区 (Stage)  →  仓库 (Repository)
     git add              git commit
```

### 常用命令速查

| 命令 | 作用 |
|------|------|
| `git init` | 初始化仓库 |
| `git add .` | 暂存所有改动 |
| `git commit -m "msg"` | 提交到本地仓库 |
| `git push` | 推送到远程 |
| `git pull` | 拉取远程更新 |
| `git log --oneline` | 查看提交历史 |
| `git status` | 查看当前状态 |
| `git branch` | 查看/创建分支 |

### 最佳实践

1. **小步提交**：一个 commit 只做一件事
2. **写清楚的 commit message**：说明"为什么"而不是"做了什么"
3. **先 pull 再 push**：避免冲突
4. **用 `.gitignore`**：排除 node_modules、.env 等

> Git 不是可选的技能，是程序员的必修课！

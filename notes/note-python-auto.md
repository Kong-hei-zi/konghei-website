## 为什么用 Python 做自动化

Python 语法简洁，标准库丰富，第三方生态庞大，是写自动化脚本的首选语言。

### 文件批量处理

```python
from pathlib import Path

folder = Path('./目标文件夹')
for i, f in enumerate(folder.iterdir()):
    f.rename(folder / f'file_{i:03d}{f.suffix}')
```

### 网页数据抓取

```python
import requests
from bs4 import BeautifulSoup

resp = requests.get('https://example.com')
soup = BeautifulSoup(resp.text, 'html.parser')
titles = soup.select('h2.title')
```

### 定时任务

- **Windows**：用"任务计划程序"
- **Linux/Mac**：用 `crontab`
- **代码内**：用 `schedule` 库

> Python 自动化三件套：`os` + `shutil` + `pathlib` 搞定文件，`requests` + `bs4` 搞定网页！

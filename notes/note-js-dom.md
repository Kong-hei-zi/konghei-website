## DOM 是什么

DOM（文档对象模型）是浏览器将 HTML 解析后生成的一个树形结构，JavaScript 可以通过 DOM API 来读取和修改页面内容。

### 选择元素

```javascript
document.getElementById('myId');
document.querySelector('.my-class');
document.querySelectorAll('div.card');
```

### 修改内容

```javascript
const el = document.querySelector('.title');
el.textContent = '新标题';
el.innerHTML = '<b>粗体</b>';
el.setAttribute('href', '/new');
el.classList.add('active');
```

### 事件监听

```javascript
btn.addEventListener('click', (e) => {
  console.log('被点击了！');
});
```

> 核心思想：**选中元素 → 监听事件 → 做出响应**，三步走！

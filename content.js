/* ══════════════════════════════════════
   Konghei 个人网站 · 内容数据中心
   加内容只改这个文件！
   ══════════════════════════════════════ */

var SITE = {

  hero: {
    tag: 'WELCOME_TO_MY_WORLD',
    title: 'KONGHEI',
    subtitle: 'PERSONAL SPACE',
    desc: '透过这扇窗，看看我的世界。外面是霓虹闪烁的城市，房间里是我正在搭建的一切。'
  },

  blog: [
    {
      id: "user-1782190660938",
      date: "2026-06-23",
      title: "test",
      summary: "这是一条测试笔记",
      tag: "随笔",
      body: "这是一条测试笔记"
    },
    {
      id: "seed-0",
      date: "2026-06-20",
      title: "如何从零搭建一个个人网站",
      summary: "从域名选择到代码部署，完整记录我的建站过程与踩坑经验。",
      tag: "Web开发",
      body: "<h2>为什么要建站</h2><p>互联网时代，拥有一个属于自己的网站就像在数字世界里拥有一个家。</p><h2>三步走</h2><ol><li><strong>写代码</strong>：HTML + CSS + JavaScript，三个文件就能搭出一个完整网站</li><li><strong>部署</strong>：推送到 GitHub Pages，免费、稳定、自动部署</li><li><strong>绑定域名</strong>：买一个喜欢的域名，DNS 指向 GitHub Pages 即可</li></ol><h2>心得</h2><p>先动手，再完美。</p>"
    }
  ],

  portfolio: [
    {
      id: 'proj-1',
      icon: '🐱',
      title: '萌宠照片墙',
      summary: '猫咪日常展示网页，图片懒加载 + 瀑布流。',
      tag: 'HTML/CSS',
      body: '<h2>项目简介</h2><p>纯 HTML/CSS 实现，图片懒加载与瀑布流布局。</p><h2>技术要点</h2><ul><li>CSS Grid 瀑布流</li><li>Intersection Observer 懒加载</li><li>响应式适配</li></ul>'
    },
    {
      id: 'proj-2',
      icon: '📖',
      title: '考研词汇助手',
      summary: '艾宾浩斯遗忘曲线背单词，CLI 工具。',
      tag: 'Python',
      body: '<h2>项目简介</h2><p>艾宾浩斯遗忘曲线 + Markdown 词库的CLI背单词工具。</p><h2>技术要点</h2><ul><li>遗忘曲线算法</li><li>Markdown 词库</li><li>零依赖CLI</li></ul>'
    },
    {
      id: 'proj-3',
      icon: '🤖',
      title: '微信自动回复机器人',
      summary: 'wxauto + DeepSeek API，智能聊天助手。',
      tag: 'Python',
      body: '<h2>项目简介</h2><p>wxauto + DeepSeek API，PC微信智能聊天助手。</p><h2>技术要点</h2><ul><li>wxauto 操控微信</li><li>DeepSeek API 回复</li><li>关键词触发 + 白名单</li></ul>'
    },
    {
      id: 'proj-4',
      icon: '🌐',
      title: '个人网站 konghei.cn',
      summary: '就是你正在浏览的这个！纯手工打造。',
      tag: 'Web开发',
      body: '<h2>项目简介</h2><p>就是这里！纯 HTML/CSS/JS，GitHub Pages 部署。</p><h2>技术栈</h2><ul><li>HTML5 + CSS3</li><li>原生 JavaScript</li><li>GitHub Pages</li></ul>'
    }
  ],

  shop: [
    { icon: '📸', title: '定制头像绘制', desc: '手绘风格头像，赛璐璐/厚涂均可', price: '¥ 50 起' },
    { icon: '📝', title: '简历润色服务', desc: '针对性优化，提升面试邀约率', price: '¥ 30 起' },
    { icon: '💻', title: '简单网页制作', desc: '个人主页/作品集/Landing Page', price: '¥ 100 起' }
  ],

  notes: [
    { title: '编程', items: ['HTML/CSS 基础入门', 'JavaScript DOM 操作', 'Python 自动化脚本', 'Git 版本控制'] },
    { title: '考研', items: ['英语长难句精析', '数学公式速查', '政治时间线梳理', '专业课知识图谱'] },
    { title: '金融', items: ['FRM 风险管理笔记', 'Basel III 市场风险', '投资组合理论', '期权定价模型'] },
    { title: '工具', items: ['Obsidian 使用技巧', 'Claude Code 命令大全', '命令行常用操作', '飞书多维表格公式'] }
  ]
};

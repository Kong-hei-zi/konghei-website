/* ══════════════════════════════════════
   Konghei 个人网站 · 内容数据中心
   博客文章已迁移至 /posts/ 目录，每篇一个 .md 文件
   ══════════════════════════════════════ */

var SITE = {

  hero: {
    tag: 'WELCOME_TO_MY_WORLD',
    title: 'KONGHEI',
    subtitle: 'PERSONAL SPACE',
    desc: '透过这扇窗，看看我的世界。外面是霓虹闪烁的城市，房间里是我正在搭建的一切。'
  },

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

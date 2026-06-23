/* ══════════════════════════════════════
   Konghei 个人网站 · 内容数据中心
   博客文章已迁移至 /posts/ 目录，每篇一个 .md 文件
   作品集项目截图存放在 /projects/ 目录
   ══════════════════════════════════════ */

var SITE = {

  hero: {
    tag: 'WELCOME_TO_MY_WORLD',
    title: 'KONGHEI',
    subtitle: 'PERSONAL SPACE',
    desc: '透过这扇窗，看看我的世界。外面是霓虹闪烁的城市，房间里是我正在搭建的一切。'
  },

  /* 作品集数据已迁移至 /projects/index.json，通过 portfolio.html fetch 加载 */

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

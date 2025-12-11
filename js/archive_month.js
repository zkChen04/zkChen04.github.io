/**
 * 这是一个 JS 脚本，用于在归档页自动按月插入分隔标题
 * 使用方法：
 * 1. 在 source/js/ 目录下新建文件 archive_month.js
 * 2. 将此代码粘贴进去
 * 3. 在 _config.butterfly.yml 中配置 inject (见下方注释)
 */

document.addEventListener('DOMContentLoaded', function () {
  // 只在归档页运行
  const archivePage = document.getElementById('archive');
  // 精确匹配归档页面路径，避免在标签等子页面执行
  if (!archivePage || !/^\/archives\/?$/.test(location.pathname)) return;

  const items = document.querySelectorAll('.article-sort-item');
  let lastMonth = '';

  items.forEach(item => {
    // 跳过年份标题
    if (item.classList.contains('year')) {
      lastMonth = ''; // 重置年份
      return;
    }

    const timeElement = item.querySelector('time');
    if (!timeElement) return;

    // 获取当前文章的日期 (YYYY-MM-DD)
    const dateStr = timeElement.getAttribute('datetime') || timeElement.innerText;
    const currentMonth = new Date(dateStr).getMonth() + 1; // 1-12

    // 如果月份变化了，插入月份标题
    if (currentMonth !== lastMonth) {
      const monthHeader = document.createElement('div');
      monthHeader.className = 'article-sort-item month-label';
      monthHeader.innerHTML = `<span style="font-size: 1.2em; font-weight: bold; color: #49b1f5; margin-left: 10px;">${currentMonth}月</span>`;
      
      // 插入到当前文章之前
      item.parentNode.insertBefore(monthHeader, item);
      lastMonth = currentMonth;
    }
  });
});

/*
=== 必须配置 _config.butterfly.yml 才能生效 ===
inject:
  head:
  bottom:
    - <script src="/js/archive_month.js"></script>
*/
/**
 * 归档页月份折叠逻辑 - PJAX 适配版
 * 放在 source/js/archive_fold.js
 */

const initArchiveFold = () => {
  // 1. 检查是否在归档页
  const archivePage = document.getElementById('archive');
  if (!archivePage) return;

  // 2. 获取所有的月份标题
  const monthHeaders = archivePage.querySelectorAll('.archive-month-header');
  if (monthHeaders.length === 0) return;

  // 3. 默认隐藏所有文章（重置状态）
  // 排除掉 year 标题，只隐藏文章本身
  const allArticles = archivePage.querySelectorAll('.article-sort-item:not(.year)');
  allArticles.forEach(article => {
    // 强制添加隐藏类
    article.classList.add('is-hidden');
  });

  // 4. 绑定点击事件
  monthHeaders.forEach(header => {
    // 关键：防止 PJAX 重复绑定事件
    // 如果已经绑定过，直接跳过
    if (header.classList.contains('js-bound')) return;
    header.classList.add('js-bound');

    header.addEventListener('click', function () {
      // 切换当前标题的状态
      this.classList.toggle('active');
      
      // 切换图标
      const icon = this.querySelector('.folder-icon');
      if (icon) {
        if (this.classList.contains('active')) {
          icon.classList.remove('fa-folder');
          icon.classList.add('fa-folder-open');
        } else {
          icon.classList.remove('fa-folder-open');
          icon.classList.add('fa-folder');
        }
      }

      // 切换同月文章的显示/隐藏
      // 从标题的下一个元素开始遍历，直到遇到下一个标题或年份
      let nextSibling = this.nextElementSibling;
      while (nextSibling && nextSibling.classList.contains('article-sort-item') && !nextSibling.classList.contains('year')) {
        nextSibling.classList.toggle('is-hidden');
        nextSibling = nextSibling.nextElementSibling;
      }
    });
  });
};

// 5. 事件监听 (解决 PJAX 问题的核心)
// 页面首次加载
document.addEventListener('DOMContentLoaded', initArchiveFold);
// PJAX 跳转完成
document.addEventListener('pjax:complete', initArchiveFold);
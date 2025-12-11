/**
 * 修复 Butterfly 主题 Top Image 预加载在 PJAX 跳转失效的问题
 * 并增加了超时保护和更稳健的 URL 提取方式
 */

function checkBackgroundImage() {
  // 1. 获取需要检测的元素
  var fullPageElement = document.querySelector('#page-header.full_page') || document.querySelector('.post-bg') || document.querySelector('#page-header');
  
  // 如果没有找到相关元素，直接返回显示
  if (!fullPageElement) {
    document.body.style.visibility = 'visible';
    document.body.style.overflow = 'auto';
    return;
  }

  // 2. 隐藏页面 (建议配合 CSS loading 动画，否则用户会以为网页卡死)
  // 注意：在 PJAX 跳转中突然隐藏 body 可能会有闪烁，这是正常的
  document.body.style.visibility = 'hidden';
  document.body.style.overflow = 'hidden';

  // 3. 获取计算后的背景图片地址
  var style = window.getComputedStyle(fullPageElement);
  var backgroundImage = style.backgroundImage;

  // 4. 更稳健的 URL 提取 (正则匹配)，兼容有无引号的情况
  // 匹配 url("...") 或 url('...') 或 url(...)
  var urlMatch = backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
  var imageUrl = urlMatch ? urlMatch[1] : null;

  console.log('Preloading Background:', imageUrl);

  // 定义显示页面的辅助函数，避免代码重复
  var showPage = function() {
    document.body.style.visibility = 'visible';
    document.body.style.overflow = 'auto';
  };

  // 5. 判断逻辑
  if (imageUrl && imageUrl !== 'none') {
    var img = new Image();
    img.crossOrigin = "anonymous"; 

    // 设置超时保护：如果 3秒还没加载完，强制显示页面，别让用户干等
    var timer = setTimeout(function() {
      console.warn('Background image load timed out.');
      showPage();
    }, 3000);

    img.onload = function() {
      clearTimeout(timer); // 清除超时定时器
      console.log('Background image loaded.');
      showPage();
    };

    img.onerror = function() {
      clearTimeout(timer);
      console.error('Failed to load background image.');
      showPage();
    };

    img.src = imageUrl;
    
    // 如果图片已经被浏览器缓存，onload 可能不会触发，检查 complete 属性
    if (img.complete) {
        clearTimeout(timer);
        showPage();
    }

  } else {
    // 没有背景图，直接显示
    showPage();
  }
}

// 6. 事件监听
// 首次加载
document.addEventListener('DOMContentLoaded', checkBackgroundImage);

// PJAX 跳转加载 (Butterfly 核心修改点)
document.addEventListener('pjax:complete', checkBackgroundImage);
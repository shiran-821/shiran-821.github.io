/* 作品集页面交互：视频点播 + 截图灯箱 + 平滑滚动 */
(function () {
  'use strict';

  /* ---------- 视频：点击封面后加载并播放 ---------- */
  function mount(frame) {
    var src = frame.getAttribute('data-video');
    if (!src) return;
    var cover = frame.querySelector('.vc-cover');
    var video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata';

    video.addEventListener('error', function () {
      video.remove();
      if (cover) cover.style.display = '';
      var tip = frame.querySelector('.vc-tip');
      if (!tip) {
        tip = document.createElement('div');
        tip.className = 'vc-tip';
        tip.textContent = '录屏加载失败，请刷新页面重试';
        tip.style.cssText =
          'position:absolute;left:0;right:0;bottom:0;padding:8px 12px;' +
          'background:rgba(0,0,0,.72);color:#FFC9B8;font-size:11.5px;' +
          'font-family:ui-monospace,monospace;z-index:2';
        frame.appendChild(tip);
      }
    });

    if (cover) cover.style.display = 'none';
    frame.appendChild(video);
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* 自动播放被拦截时交给控制条 */ });
  }

  document.querySelectorAll('.vc-frame').forEach(function (frame) {
    frame.addEventListener('click', function (e) {
      if (e.target.tagName === 'VIDEO' || frame.querySelector('video')) return;
      mount(frame);
    });
    frame.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && !frame.querySelector('video')) {
        e.preventDefault();
        mount(frame);
      }
    });
  });

  /* ---------- 截图灯箱 ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.shot img').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.getAttribute('data-full') || img.src);
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------- 锚点平滑滚动 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.pageYOffset - 66;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

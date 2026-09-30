// 스크린샷을 누르면 크게 본다. 좌우로 넘기고, 바깥·×·Esc 로 닫는다.
// 큰 그림은 /img/full/ 의 1080px 판을 쓴다 - 목록의 540px 를 키우면 흐리다.
(function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.shots .shot'));
  var shots = buttons.map(function (b) { return b.querySelector('img'); });
  if (!shots.length) return;
  var en = document.documentElement.lang === 'en';

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lb-btn lb-close" aria-label="' + (en ? 'Close' : '닫기') + '">×</button>' +
    '<button class="lb-btn lb-prev" aria-label="' + (en ? 'Previous' : '이전') + '">‹</button>' +
    '<img alt="">' +
    '<button class="lb-btn lb-next" aria-label="' + (en ? 'Next' : '다음') + '">›</button>' +
    '<div class="lb-count"></div>';
  document.body.appendChild(box);

  var img = box.querySelector('img');
  var count = box.querySelector('.lb-count');
  var index = 0;
  var opener = null;

  function show(i) {
    index = (i + shots.length) % shots.length;
    var s = shots[index];
    img.src = s.getAttribute('src').replace('/img/', '/img/full/');
    img.alt = s.alt;
    count.textContent = (index + 1) + ' / ' + shots.length;
  }
  function open(i) {
    opener = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }

  // 버튼이라 키보드 초점·Enter 는 브라우저가 해 준다.
  buttons.forEach(function (b, i) {
    b.addEventListener('click', function () { open(i); });
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
  // 그림 바깥(검은 바탕)을 누르면 닫는다.
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });

  // 휴대폰: 옆으로 밀어 넘긴다.
  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });
})();

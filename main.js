'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initFaq();
  initFadeIn();
  initGtmEvents();
  initButtonAnimations();      // ← 新規追加
  initCountUpNumbers();         // ← 新規追加
  initHeroAnimation();          // ← 新規追加
  initReservationWarning();
});

// 既存のinitCountdown関数を置き換え

function initCountdown() {
  const endDate = new Date('2025-12-15T23:59:59+09:00');
  const el = document.getElementById('countdown');
  if (!el) return;

  function update() {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) {
      el.textContent = 'キャンペーン終了';
      el.style.color = '#C4632A'; // 赤色に変更
      return;
    }
    
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000); // ← 秒を追加
    
    // 残り3日以内は秒数も表示
    if (d <= 3) {
      el.textContent = `残り ${d}日 ${h}時間 ${m}分 ${s}秒`;
      el.style.color = '#C4632A'; // 赤色で緊急感
      el.style.fontWeight = '400';
    } else {
      el.textContent = `残り ${d}日 ${h}時間 ${m}分`;
    }
  }

  update();
  setInterval(update, 1000); // ← 1秒ごとに更新（既存は60秒）
}

/**
 * 10-2. FAQアコーディオン（WAI-ARIA対応）
 */
function initFaq() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // 他を閉じる
      questions.forEach(other => {
        if (other === btn) return;
        const otherItem = other.closest('.faq-item');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        other.setAttribute('aria-expanded', 'false');
        otherAnswer.classList.remove('is-open');
        otherAnswer.setAttribute('hidden', '');
      });

      // 自分をトグル
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('is-open');
        answer.setAttribute('hidden', '');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
        // rAFで hidden 解除後にクラス付与（transition発火のため）
        requestAnimationFrame(() => answer.classList.add('is-open'));
      }
    });
  });
}

/**
 * 10-3. スクロールフェードイン（IntersectionObserver）
 * ★ 改善版：より滑らかに
 */
function initFadeIn() {
  const targets = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 少し遅延を加えて順番に表示
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '-50px' // 50px早めに発火
  });
  
  targets.forEach(el => observer.observe(el));
}

/**
 * 10-4. GTMイベント送信
 */
function initGtmEvents() {
  const ctaButtons = document.querySelectorAll('[data-gtm-event]');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof window.dataLayer === 'undefined') return;
      window.dataLayer.push({
        event: btn.dataset.gtmEvent,
        plan: btn.dataset.gtmPlan || '',
        position: btn.dataset.gtmPosition || '',
      });
    });
  });
}

// 予約離脱防止ポップアップ

function initReservationWarning() {
  const reserveLinks = document.querySelectorAll('a[href*="yuge-reserve.jp"]');
  
  reserveLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // GTMイベント送信後、0.5秒待ってから遷移
      e.preventDefault();
      const href = link.getAttribute('href');
      
      // ローディング表示（オプション）
      const originalText = link.textContent;
      link.textContent = '予約ページへ移動中...';
      link.style.opacity = '0.7';
      
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });
}

/**
 * ★ 10-5. ボタンアニメーション（新規）
 * ホバー時に微細な動きを追加
 */
function initButtonAnimations() {
  const buttons = document.querySelectorAll('.btn-hero, .plan-cta-primary, .btn-final-primary');
  
  buttons.forEach(btn => {
    // ホバー時にアイコンを動かす
    btn.addEventListener('mouseenter', () => {
      const icon = btn.querySelector('svg');
      if (icon) {
        icon.style.transform = 'translateX(4px)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      const icon = btn.querySelector('svg');
      if (icon) {
        icon.style.transform = 'translateX(0)';
      }
    });
  });
}

/**
 * ★ 10-6. 数字カウントアップアニメーション（新規）
 * 統計セクションの数字をアニメーション
 */
function initCountUpNumbers() {
  const statValues = document.querySelectorAll('.stat-value');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        
        // 数字部分を抽出（例: "4.7" or "5万+" → 4.7 or 5）
        const match = text.match(/[\d.]+/);
        if (!match) return;
        
        const targetValue = parseFloat(match[0]);
        const isDecimal = text.includes('.');
        const suffix = text.replace(/[\d.]+/, ''); // "/5" や "万+" など
        
        animateNumber(el, 0, targetValue, 1500, isDecimal, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(el => observer.observe(el));
}

/**
 * 数字アニメーション実行関数
 */
function animateNumber(element, start, end, duration, isDecimal, suffix) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // イージング（ease-out）
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * easeProgress;
    
    if (isDecimal) {
      element.textContent = current.toFixed(1) + suffix;
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * ★ 10-7. ヒーローセクションの初回アニメーション（新規）
 */
function initHeroAnimation() {
  const heroCenter = document.querySelector('.hero-center');
  if (!heroCenter) return;
  
  // ページ読み込み時に要素を順番に表示
  const children = heroCenter.children;
  Array.from(children).forEach((child, index) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    }, 200 + index * 150); // 200ms後から順番に表示
  });
}

// ============================================
// 予約フォーム送信
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reservationForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  
  // ★★★ ここに自分のGAS WebアプリURLを貼り付け ★★★
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyP35DXfjnKyc21lLg1RU24_oFS579pUqJN3YtcnXjYz9gYNaqHxZcPFwDgL0QFs2ENbw/exec';
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // ボタンを無効化
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';
      formMessage.style.display = 'none';
      
      // フォームデータを取得
      const formData = new FormData(form);
      
      // GASに送信
      fetch(GAS_URL, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          // 成功時
          formMessage.textContent = '✓ 予約を受け付けました。確認メールをお送りしますのでご確認ください。';
          formMessage.className = 'form-message success';
          formMessage.style.display = 'block';
          form.reset();
        } else {
          throw new Error(data.message);
        }
      })
      .catch(error => {
        // エラー時
        formMessage.textContent = '⚠ 送信に失敗しました。もう一度お試しください。';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        console.error('Error:', error);
      })
      .finally(() => {
        // ボタンを再有効化
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C5 2 2 5 3 9c1 3 4 4 7 3C8 14 4 12 3 9 2 5 5 2 7 1z" fill="#DDF0D8"/></svg>予約を送信する';
      });
    });
  }
});

/**
 * ★ 予約フォーム送信処理
 */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  // ★★★ ここにGASのウェブアプリURLを貼り付け ★★★
  const GAS_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec';
  // ↑ ステップ2-3でコピーしたURLに置き換えてください

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ボタンとメッセージを取得
    const submitBtn = form.querySelector('.form-submit-btn');
    const loading = document.getElementById('formLoading');
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');

    // フォームデータを取得
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      plan: document.getElementById('plan').value,
      date: document.getElementById('date').value,
      coupon: document.getElementById('coupon').value
    };

    // ローディング表示
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    loading.style.display = 'block';
    success.style.display = 'none';
    error.style.display = 'none';

    try {
      // GASに送信
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // 成功
        success.style.display = 'block';
        form.reset();
        
        // GTMイベント送信（オプション）
        if (typeof window.dataLayer !== 'undefined') {
          window.dataLayer.push({
            event: 'reservation_complete',
            plan: formData.plan
          });
        }
      } else {
        // エラー
        error.style.display = 'block';
        error.textContent = 'エラーが発生しました：' + (result.error || '不明なエラー');
      }
    } catch (err) {
      // ネットワークエラー
      error.style.display = 'block';
      error.textContent = '送信に失敗しました。インターネット接続を確認してください。';
      console.error('Form submission error:', err);
    } finally {
      // ローディング終了
      loading.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });
}

// DOMContentLoadedに追加
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initFaq();
  initFadeIn();
  initGtmEvents();
  initButtonAnimations();
  initCountUpNumbers();
  initHeroAnimation();
  initReservationForm(); // ← 追加
});
'use strict';

// ===== 1. カウントダウン =====
function initCountdown() {
  // 2026年4月30日 23:59:59に終了
  const endDate = new Date('2026-05-30T23:59:59+09:00');
  
  const el = document.getElementById('countdown');
  
  console.log('カウントダウン開始');
  console.log('要素:', el);
  console.log('終了日時:', endDate);
  
  if (!el) {
    console.error('countdown要素が見つかりません');
    return;
  }

  function update() {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) {
      el.textContent = 'キャンペーン終了';
      el.style.color = '#C4632A';
      return;
    }
    
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    if (d <= 3) {
      el.textContent = `残り ${d}日 ${h}時間 ${m}分 ${s}秒`;
      el.style.color = '#C4632A';
      el.style.fontWeight = '400';
    } else {
      el.textContent = `残り ${d}日 ${h}時間 ${m}分`;
    }
  }

  update();
  setInterval(update, 1000);
}

// ===== 2. FAQ =====
function initFaq() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      questions.forEach(other => {
        if (other === btn) return;
        const otherItem = other.closest('.faq-item');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        other.setAttribute('aria-expanded', 'false');
        otherAnswer.classList.remove('is-open');
        otherAnswer.setAttribute('hidden', '');
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('is-open');
        answer.setAttribute('hidden', '');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
        requestAnimationFrame(() => answer.classList.add('is-open'));
      }
    });
  });
}

// ===== 3. フェードイン =====
function initFadeIn() {
  const targets = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '-50px'
  });
  
  targets.forEach(el => observer.observe(el));
  
  const photoCards = document.querySelectorAll('.photo-card');
  
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-50px'
  });
  
  photoCards.forEach(card => cardObserver.observe(card));
}

// ===== 4. GTMイベント =====
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

// ===== 5. ボタンアニメーション =====
function initButtonAnimations() {
  const buttons = document.querySelectorAll('.btn-hero, .plan-cta-primary, .btn-final-primary');
  
  buttons.forEach(btn => {
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

// ===== 6. カウントアップ =====
function initCountUpNumbers() {
  const statValues = document.querySelectorAll('.stat-value');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        
        const match = text.match(/[\d.]+/);
        if (!match) return;
        
        const targetValue = parseFloat(match[0]);
        const isDecimal = text.includes('.');
        const suffix = text.replace(/[\d.]+/, '');
        
        animateNumber(el, 0, targetValue, 1500, isDecimal, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(el => observer.observe(el));
}

function animateNumber(element, start, end, duration, isDecimal, suffix) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
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

// ===== 7. ヒーローアニメーション =====
function initHeroAnimation() {
  const heroCenter = document.querySelector('.hero-center');
  if (!heroCenter) return;
  
  const children = heroCenter.children;
  Array.from(children).forEach((child, index) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    }, 200 + index * 150);
  });
}

// ===== 8. スクロール =====
function initScrollToForm() {
  const scrollButtons = document.querySelectorAll('.scroll-to-form');
  
  scrollButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const planName = this.dataset.plan;
      
      if (planName) {
        const planSelect = document.getElementById('plan');
        if (planSelect) {
          planSelect.value = planName;
        }
      }
      
      const formSection = document.getElementById('reservation-form');
      if (formSection) {
        formSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        setTimeout(() => {
          const nameInput = document.getElementById('name');
          if (nameInput) {
            nameInput.focus();
          }
        }, 800);
      }
    });
  });
}

// ===== 9. 予約フォーム =====
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  

  // ★営業時間チェック機能
  const dateInput = document.getElementById('date');
  
  if (dateInput) {
    dateInput.addEventListener('change', function() {
      const selectedDate = new Date(this.value);
      const hours = selectedDate.getHours();
      
      if (hours < 7 || hours >= 23) {
        showError('date', '営業時間は7:00〜23:00です。営業時間内の日時を選択してください。');
        this.value = '';
      } else {
        clearError('date');
      }
    });
  }

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyP35DXfjnKyc21lLg1RU24_oFS579pUqJN3YtcnXjYz9gYNaqHxZcPFwDgL0QFs2ENbw/exec';

 const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[ぁ-んァ-ヶー一-龯\s]+$/,
      message: 'お名前を日本語で2文字以上50文字以内で入力してください'
    },
    email: {
      required: true,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '正しいメールアドレスを入力してください'
    },
    phone: {
      required: true,
      minLength: 10,
      maxLength: 13,
      pattern: /^0\d{1,4}-?\d{1,4}-?\d{4}$/,
      message: '電話番号を正しく入力してください（例: 090-1234-5678）'
    },
    plan: {
      required: true,
      message: 'プランを選択してください'
    },
    coupon: {
      pattern: /^[A-Z0-9]*$/,
      maxLength: 20,
      message: 'クーポンコードは半角英数大文字のみで入力してください'
    }
  };

  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    
    if (input && error) {
      input.classList.add('error');
      error.textContent = message;
      error.classList.add('show');
    }
  }

  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    
    if (input && error) {
      input.classList.remove('error');
      error.classList.remove('show');
    }
  }

  function clearAllErrors() {
    Object.keys(validationRules).forEach(fieldId => {
      clearError(fieldId);
    });
  }

  function validateForm() {
    let isValid = true;
    clearAllErrors();

    Object.keys(validationRules).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      const rule = validationRules[fieldId];
      
      if (!field) return;

      const value = field.value.trim();

      // 必須チェック
      if (rule.required && !value) {
        showError(fieldId, rule.message);
        isValid = false;
        return;
      }

      // 最小文字数チェック
      if (rule.minLength && value && value.length < rule.minLength) {
        showError(fieldId, rule.message);
        isValid = false;
        return;
      }

      // 最大文字数チェック
      if (rule.maxLength && value && value.length > rule.maxLength) {
        showError(fieldId, rule.message);
        isValid = false;
        return;
      }

      // パターンチェック
      if (rule.pattern && value && !rule.pattern.test(value)) {
        showError(fieldId, rule.message);
        isValid = false;
        return;
      }
    });

    // 営業時間チェック
    const dateField = document.getElementById('date');
    if (dateField && dateField.value) {
      const selectedDate = new Date(dateField.value);
      const hours = selectedDate.getHours();
      
      if (hours < 7 || hours >= 23) {
        showError('date', '営業時間は7:00〜23:00です。営業時間内の日時を選択してください。');
        isValid = false;
      }
    }

    return isValid;
  }

  Object.keys(validationRules).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', () => {
        clearError(fieldId);
      });
      field.addEventListener('change', () => {
        clearError(fieldId);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.form-input.error, .form-select.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    const submitBtn = form.querySelector('.form-submit-btn');
    const loading = document.getElementById('formLoading');
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');

    // 日付と時間を統合
    const reservationDate = document.getElementById('reservation-date');
    const reservationTime = document.getElementById('reservation-time');
    const dateValue = (reservationDate && reservationTime) 
      ? `${reservationDate.value}T${reservationTime.value}`
      : document.getElementById('date').value;

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      plan: document.getElementById('plan').value,
      date: dateValue,
      coupon: document.getElementById('coupon').value
    };
    
    console.log('送信データ:', formData);

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    loading.style.display = 'block';
    success.style.display = 'none';
    error.style.display = 'none';

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // no-corsモードでは応答が取得できないため、送信成功と仮定
      success.style.display = 'block';
      form.reset();
      
      if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
          event: 'reservation_complete',
          plan: formData.plan
        });
      }
      
      console.log('送信完了');
      
    } catch (err) {
      error.style.display = 'block';
      error.textContent = '送信に失敗しました。インターネット接続を確認してください。';
      console.error('Form submission error:', err);
    } finally {
      loading.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM読み込み完了');
  
  initCountdown();
  initFaq();
  initFadeIn();
  initGtmEvents();
  initButtonAnimations();
  initCountUpNumbers();
  initHeroAnimation();
  initReservationForm();
  initScrollToForm();
  
  console.log('全ての初期化完了');
});
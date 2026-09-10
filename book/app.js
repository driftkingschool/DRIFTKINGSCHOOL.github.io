/* DKS Booking page - package -> free slot -> CardCom (full / 350 deposit) -> calendar hold.
   10/09/26 hardening: resume a live hold, release your own hold, pick another slot, banner errors in 4 languages,
   honeypot handled quietly, RTL/LTR arrows, empty-month note, package switch, recheck after a long verification. */
(function () {
  'use strict';
  var CONFIG = {
    url: 'https://script.google.com/macros/s/AKfycbyX80BdKV6fdp7ylZwmIKVSQOGWLQugqnoEs57EiViBZNdN5zI0U08qsVyo1iebB6N7ow/exec',
    wa: 'https://wa.me/972537757323',
    home: 'https://driftkingschool.github.io/'
  };
  var PKG_UI = {
    taste:    { sub: { he: 'טעימת דריפט', en: 'Drift taster', ru: 'Знакомство с дрифтом', ar: 'تذوق الدرفت' }, sessions: 2, net: 30 },
    advanced: { sub: { he: 'דריפט מתקדם', en: 'Advanced drift', ru: 'Продвинутый дрифт', ar: 'درفت متقدم' }, sessions: 3, net: 45 },
    pro:      { sub: { he: 'דריפט מקצועי', en: 'Pro drift', ru: 'Профессиональный дрифт', ar: 'درفت احترافي' }, sessions: 5, net: 75 },
    duo:      { sub: { he: 'חבילה זוגית', en: 'Couple package', ru: 'Парный пакет', ar: 'باقة زوجية' }, sessions: 4, net: 60 },
    king:     { sub: { he: 'מלך הדריפט', en: 'Drift King', ru: 'Король дрифта', ar: 'ملك الدرفت' }, sessions: 10, net: 150 },
    owncar:   { sub: { he: 'על הרכב שלך', en: 'Your own car', ru: 'На вашем авто', ar: 'بسيارتك' }, sessions: 2, net: 30 },
    taxi:     { sub: { he: 'טקסי דריפט', en: 'Drift taxi', ru: 'Дрифт-такси', ar: 'تاكسي درفت' }, sessions: 1, net: 5 }
  };
  var PKG_ORDER = ['taste', 'advanced', 'pro', 'duo', 'king', 'owncar', 'taxi'];
  var I18N = {
    sessions: { he: '{n} מקצי נהיגה', en: '{n} driving sessions', ru: '{n} заезда', ar: '{n} جلسات قيادة' },
    session1: { he: 'מקצה אחד כנוסע', en: 'One ride as passenger', ru: 'Один заезд пассажиром', ar: 'جلسة واحدة كراكب' },
    net: { he: '{n} דק׳ נהיגה נטו', en: '{n} min net driving', ru: '{n} мин чистой езды', ar: '{n} دقيقة قيادة فعلية' },
    dur: { he: 'משך: כ-{h}', en: 'Duration: about {h}', ru: 'Длительность: около {h}', ar: 'المدة: حوالي {h}' },
    hours: { he: ['שעה', 'שעתיים', '{n} שעות'], en: ['1 hour', '2 hours', '{n} hours'], ru: ['1 час', '2 часа', '{n} часов'], ar: ['ساعة', 'ساعتان', '{n} ساعات'] },
    mins: { he: '{n} דקות', en: '{n} minutes', ru: '{n} минут', ar: '{n} دقيقة' },
    depositOk: { he: 'אפשר לשריין במקדמה של 350 ₪ ולשלם את היתרה במקום.', en: 'You can hold your slot with a 350 ₪ deposit and pay the balance on site.', ru: 'Можно забронировать авансом 350 ₪ и доплатить на месте.', ar: 'يمكنك الحجز بعربون 350 ₪ ودفع الباقي في الموقع.' },
    depositNo: { he: 'חבילה זו נמכרת בתשלום מלא בלבד.', en: 'This package is sold with full payment only.', ru: 'Этот пакет оплачивается только полностью.', ar: 'هذه الباقة تُباع بالدفع الكامل فقط.' },
    fullSub: { he: '{n} ₪ עכשיו, בלי יתרה', en: '{n} ₪ now, nothing left to pay', ru: '{n} ₪ сейчас, без остатка', ar: '{n} ₪ الآن، دون متبقٍ' },
    depSub: { he: '350 ₪ עכשיו, {n} ₪ בהגעה', en: '350 ₪ now, {n} ₪ on arrival', ru: '350 ₪ сейчас, {n} ₪ при прибытии', ar: '350 ₪ الآن و{n} ₪ عند الوصول' },
    chosen: { he: 'נבחר: {d} בשעה {t} (עד {e})', en: 'Selected: {d} at {t} (until {e})', ru: 'Выбрано: {d} в {t} (до {e})', ar: 'المختار: {d} الساعة {t} (حتى {e})' },
    noSlots: { he: 'אין שעות פנויות ביום הזה', en: 'No free times on this day', ru: 'Нет свободного времени в этот день', ar: 'لا توجد أوقات متاحة في هذا اليوم' },
    noMonth: { he: 'אין מועדים פנויים בחודש הזה. נסו את החודש הבא.', en: 'No free slots this month. Try the next month.', ru: 'В этом месяце нет свободных слотов. Попробуйте следующий.', ar: 'لا مواعيد متاحة هذا الشهر. جرّب الشهر التالي.' },
    pickDay: { he: 'בחרו יום מהלוח', en: 'Pick a day from the calendar', ru: 'Выберите день в календаре', ar: 'اختر يومًا من التقويم' },
    sending: { he: 'שומרים לך את המועד...', en: 'Holding your slot...', ru: 'Удерживаем слот...', ar: 'نحجز موعدك...' },
    releasing: { he: 'משחררים את המועד...', en: 'Releasing the slot...', ru: 'Освобождаем слот...', ar: 'نحرّر الموعد...' },
    days: { he: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'], en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], ar: ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'] },
    failedTitle: { he: 'התשלום לא הושלם', en: 'Payment was not completed', ru: 'Оплата не завершена', ar: 'لم يكتمل الدفع' },
    cancelTitle: { he: 'ביטלת את התשלום', en: 'You cancelled the payment', ru: 'Вы отменили оплату', ar: 'ألغيت الدفع' },
    confirm: { he: '<strong>{p}</strong><br>מתי: <strong>{d} · {t}-{e}</strong><br>איפה: <strong>מוטור סיטי, באר שבע</strong><br>{pay}<br>מספר הזמנה: <strong>{bk}</strong>',
               en: '<strong>{p}</strong><br>When: <strong>{d} · {t}-{e}</strong><br>Where: <strong>Motor City, Beer Sheva</strong><br>{pay}<br>Booking ID: <strong>{bk}</strong>',
               ru: '<strong>{p}</strong><br>Когда: <strong>{d} · {t}-{e}</strong><br>Где: <strong>Мотор Сити, Беэр-Шева</strong><br>{pay}<br>Номер брони: <strong>{bk}</strong>',
               ar: '<strong>{p}</strong><br>متى: <strong>{d} · {t}-{e}</strong><br>أين: <strong>موتور سيتي، بئر السبع</strong><br>{pay}<br>رقم الحجز: <strong>{bk}</strong>' },
    paidFull: { he: 'שולם במלואו: {a} ₪', en: 'Paid in full: {a} ₪', ru: 'Оплачено полностью: {a} ₪', ar: 'مدفوع بالكامل: {a} ₪' },
    paidDep: { he: 'שולמה מקדמה {a} ₪ · יתרה במקום: {l} ₪', en: 'Deposit paid {a} ₪ · balance on site: {l} ₪', ru: 'Аванс {a} ₪ · остаток на месте: {l} ₪', ar: 'عربون مدفوع {a} ₪ · المتبقي في الموقع: {l} ₪' },
    resumeChosen: { he: '{p} · {d} בשעה {t}', en: '{p} · {d} at {t}', ru: '{p} · {d} в {t}', ar: '{p} · {d} الساعة {t}' },
    errTitle: { he: 'לא הצלחנו להמשיך', en: 'We could not continue', ru: 'Не удалось продолжить', ar: 'تعذّر المتابعة' },
    errHelp: { he: 'עזרה בוואטסאפ', en: 'Help on WhatsApp', ru: 'Помощь в WhatsApp', ar: 'مساعدة عبر واتساب' },
    waHelp: { he: 'היי, ניסיתי להזמין {p} ל-{d} {t} ונתקלתי בבעיה. שם: {n} טלפון: {ph}', en: 'Hi, I tried to book {p} for {d} {t} and hit a problem. Name: {n} phone: {ph}', ru: 'Здравствуйте, мне не удалось забронировать {p} на {d} {t}. Имя: {n}, телефон: {ph}', ar: 'مرحباً، حاولت حجز {p} ليوم {d} {t} وواجهت مشكلة. الاسم: {n} الهاتف: {ph}' },
    err: {
      slot_taken: { he: 'המועד נתפס הרגע. בחרו מועד אחר.', en: 'That slot was just taken. Please pick another.', ru: 'Слот только что заняли. Выберите другой.', ar: 'تم حجز الموعد للتو. اختر موعدًا آخر.' },
      slot: { he: 'המועד לא תקין. בחרו יום ושעה מהלוח.', en: 'Invalid slot. Pick a day and time from the calendar.', ru: 'Неверный слот. Выберите день и время в календаре.', ar: 'الموعد غير صالح. اختر يومًا وساعة من التقويم.' },
      active_hold: { he: 'יש לך כבר מועד שמור בתהליך תשלום.', en: 'You already have a slot on hold.', ru: 'У вас уже есть удержанный слот.', ar: 'لديك موعد محجوز قيد الدفع.' },
      rate: { he: 'יותר מדי ניסיונות בשעה האחרונה. אפשר לנסות שוב בעוד כ-{m} דקות, או לכתוב לנו בוואטסאפ.', en: 'Too many attempts in the last hour. Try again in about {m} min, or message us on WhatsApp.', ru: 'Слишком много попыток за последний час. Попробуйте снова примерно через {m} мин или напишите в WhatsApp.', ar: 'محاولات كثيرة في الساعة الأخيرة. حاول مجددًا بعد نحو {m} دقيقة أو راسلنا على واتساب.' },
      deposit_not_allowed: { he: 'לחבילה הזו אין מקדמה. בחרו תשלום מלא.', en: 'No deposit for this package. Choose full payment.', ru: 'Для этого пакета нет аванса. Выберите полную оплату.', ar: 'لا عربون لهذه الباقة. اختر الدفع الكامل.' },
      booking_closed: { he: 'הזמנה אונליין פתוחה עד 22:40. חזרו אחרי חצות או כתבו לנו בוואטסאפ.', en: 'Online booking is open until 22:40. Come back after midnight or WhatsApp us.', ru: 'Онлайн-бронирование открыто до 22:40. Возвращайтесь после полуночи или напишите в WhatsApp.', ar: 'الحجز أونلاين حتى 22:40. عد بعد منتصف الليل أو راسلنا.' },
      cardcom: { he: 'לא הצלחנו לפתוח דף תשלום. המועד לא נשמר. כתבו לנו בוואטסאפ ונסגור אותו ידנית.', en: 'Could not open the payment page. Slot not held. WhatsApp us and we will book it manually.', ru: 'Не удалось открыть страницу оплаты. Напишите в WhatsApp.', ar: 'تعذّر فتح صفحة الدفع. راسلنا على واتساب.' },
      busy: { he: 'המערכת עמוסה כרגע או שיש כבר כמה הזמנות ממתינות ליום הזה. נסו יום אחר או כתבו לנו בוואטסאפ.', en: 'The system is busy or this day already has several pending bookings. Try another day or message us on WhatsApp.', ru: 'Система занята или на этот день уже есть несколько ожидающих броней. Попробуйте другой день или напишите в WhatsApp.', ar: 'النظام مشغول أو يوجد لهذا اليوم عدة حجوزات معلّقة. جرّب يومًا آخر أو راسلنا على واتساب.' },
      paid: { he: 'ההזמנה הזו כבר שולמה.', en: 'This booking is already paid.', ru: 'Эта бронь уже оплачена.', ar: 'هذا الحجز مدفوع بالفعل.' },
      phone: { he: 'טלפון ישראלי, 10 ספרות שמתחילות ב-05', en: 'Israeli mobile, 10 digits starting with 05', ru: 'Израильский номер, 10 цифр, начинается с 05', ar: 'هاتف إسرائيلي، 10 أرقام تبدأ بـ 05' },
      email: { he: 'נא להזין אימייל תקין', en: 'Please enter a valid email', ru: 'Введите корректный email', ar: 'أدخل بريدًا إلكترونيًا صالحًا' },
      generic: { he: 'משהו השתבש. נסו שוב או כתבו לנו בוואטסאפ 053-775-7323.', en: 'Something went wrong. Try again or WhatsApp 053-775-7323.', ru: 'Что-то пошло не так. Попробуйте снова или напишите в WhatsApp.', ar: 'حدث خطأ. حاول مجددًا أو راسلنا على واتساب.' }
    },
    banner: {
      success: { icon: '✅', title: { he: 'חזרת מהתשלום', en: 'Back from payment', ru: 'Вы вернулись с оплаты', ar: 'عدت من الدفع' }, msg: { he: 'רגע, מאמתים מול קארדקום.', en: 'One moment, verifying with CardCom.', ru: 'Секунду, проверяем в CardCom.', ar: 'لحظة، نتحقق مع كاردكوم.' } },
      failed: { icon: '❌', title: { he: 'התשלום לא אושר', en: 'Payment not approved', ru: 'Оплата не одобрена', ar: 'لم تتم الموافقة على الدفع' }, msg: { he: 'לא חויבת. אפשר לנסות שוב.', en: 'You were not charged. You can try again.', ru: 'Списания не было. Попробуйте снова.', ar: 'لم يتم الخصم. يمكنك المحاولة مجددًا.' } },
      cancel: { icon: '↩️', title: { he: 'התשלום בוטל', en: 'Payment cancelled', ru: 'Оплата отменена', ar: 'تم إلغاء الدفع' }, msg: { he: 'המועד עדיין שמור לך לכמה דקות.', en: 'Your slot is still held for a few minutes.', ru: 'Слот ещё удержан несколько минут.', ar: 'موعدك محجوز لدقائق قليلة.' } },
      released: { icon: '✔️', title: { he: 'המועד שוחרר', en: 'Slot released', ru: 'Слот освобождён', ar: 'تم تحرير الموعد' }, msg: { he: 'אפשר לבחור מועד חדש.', en: 'You can pick a new slot.', ru: 'Можно выбрать новое время.', ar: 'يمكنك اختيار موعد جديد.' } }
    }
  };

  /* ---------- i18n (same data-XX pattern + storage key as the main site) ---------- */
  var LANGS = ['he', 'en', 'ru', 'ar'], RTL = { he: 1, ar: 1 }, STORAGE_KEY = 'dks-main-lang';
  var lang = 'he';
  try { var st = localStorage.getItem(STORAGE_KEY); if (st && LANGS.indexOf(st) !== -1) lang = st; } catch (e) {}
  function t(key, vars) {
    var node = I18N[key]; var v = node && (node[lang] || node.he); if (v === undefined) v = '';
    if (typeof v === 'string' && vars) Object.keys(vars).forEach(function (k) { v = v.split('{' + k + '}').join(vars[k]); });
    return v;
  }
  function errText(code, vars) { var n = I18N.err[code] || I18N.err.generic; var v = n[lang] || n.he; if (vars) Object.keys(vars).forEach(function (k) { v = v.split('{' + k + '}').join(vars[k]); }); return v; }
  function applyLanguage(l) {
    lang = l; document.documentElement.lang = l; document.documentElement.dir = RTL[l] ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-he]').forEach(function (el) { var v = el.getAttribute('data-' + l) || el.getAttribute('data-he'); if (el.tagName === 'TITLE') document.title = v; else el.innerHTML = v; });
    document.querySelectorAll('[data-placeholder-he]').forEach(function (el) { el.placeholder = el.getAttribute('data-placeholder-' + l) || el.getAttribute('data-placeholder-he'); });
    document.querySelectorAll('[data-aria-label-he]').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-aria-label-' + l) || el.getAttribute('data-aria-label-he')); });
    document.querySelectorAll('[data-cur-lang]').forEach(function (el) { el.textContent = l.toUpperCase(); });
    document.querySelectorAll('.lang-menu button[data-lang]').forEach(function (b) { if (b.getAttribute('data-lang') === l) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    // month arrows follow the reading direction (previous = towards the start side)
    $('cal-prev').textContent = RTL[l] ? '›' : '‹'; $('cal-next').textContent = RTL[l] ? '‹' : '›';
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) {}
    renderPkg(); renderCalendar(); renderSummary(); renderChosen(); renderResume();
    if (S.lastStatus && !$('view-failed').hidden) $('failed-title').textContent = S.lastStatus === 'cancel' ? t('cancelTitle') : t('failedTitle');
  }
  document.addEventListener('click', function (e) {
    var item = e.target.closest('.lang-menu button[data-lang]');
    if (item) { applyLanguage(item.getAttribute('data-lang')); closeMenus(); return; }
    var tg = e.target.closest('.lang-wrap .lang-toggle');
    if (tg) { var m = tg.parentElement.querySelector('.lang-menu'); var open = !m.hidden; closeMenus(); if (!open) { m.hidden = false; tg.setAttribute('aria-expanded', 'true'); } return; }
    if (!e.target.closest('.lang-wrap')) closeMenus();
  });
  function closeMenus() { document.querySelectorAll('.lang-wrap').forEach(function (w) { var m = w.querySelector('.lang-menu'); var tg = w.querySelector('.lang-toggle'); if (m) m.hidden = true; if (tg) tg.setAttribute('aria-expanded', 'false'); }); }
  var ham = document.getElementById('hamburger'), mob = document.getElementById('mobileMenu');
  if (ham && mob) ham.addEventListener('click', function () { ham.classList.toggle('active'); mob.classList.toggle('open'); });

  /* ---------- state ---------- */
  var S = { pkg: null, avail: null, dayMap: {}, month: null, date: null, time: null, submitting: false, hold: null, timerId: null, serverOffsetMs: 0, resume: null, lastStatus: null };
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && params.get('api')) CONFIG.url = params.get('api'); // local QA against a test deployment only
  function selfUrl(pkg) { var u = location.pathname + '?pkg=' + encodeURIComponent(pkg || ''); if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && params.get('api')) u += '&api=' + encodeURIComponent(params.get('api')); return u; }
  var fmtNum = function (n) { return Number(n).toLocaleString('en-US'); };
  function ddmmyyyy(ymd) { return ymd.slice(8, 10) + '/' + ymd.slice(5, 7) + '/' + ymd.slice(0, 4); }
  function addMin(hm, min) { var p = hm.split(':'); var m = Math.min(1439, Number(p[0]) * 60 + Number(p[1]) + min); return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
  function wall(ts) { var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(ts || ''); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) : 0; }
  function show(id, on) { var el = $(id); if (el) el.hidden = !on; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function readHold() { try { return JSON.parse(sessionStorage.getItem('dksBk') || 'null'); } catch (e) { return null; } }
  function clearHold() { S.hold = null; try { sessionStorage.removeItem('dksBk'); } catch (e) {} }
  function postJson(payload) {
    return fetch(CONFIG.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow' }).then(function (r) { return r.json(); });
  }

  /* ---------- banner (errors + payment return) ---------- */
  function showBanner(status) {
    var b = I18N.banner[status]; if (!b) return;
    var el = $('status-banner'); el.className = status; el.hidden = false;
    $('status-icon').textContent = b.icon; $('status-title').textContent = b.title[lang] || b.title.he; $('status-msg').textContent = b.msg[lang] || b.msg.he;
    show('status-link', false);
  }
  function showError(code, vars, waText) {
    var el = $('status-banner'); el.className = 'failed'; el.hidden = false;
    $('status-icon').textContent = '⚠️'; $('status-title').textContent = t('errTitle'); $('status-msg').textContent = errText(code, vars);
    var link = $('status-link');
    if (link) { link.hidden = !waText; if (waText) { link.href = CONFIG.wa + '?text=' + encodeURIComponent(waText); link.textContent = t('errHelp'); } }
    el.scrollIntoView({ block: 'nearest' });
  }
  $('status-close').addEventListener('click', function () { $('status-banner').hidden = true; });

  /* ---------- package panel ---------- */
  function humanDuration(min) {
    if (min < 60) return t('mins', { n: min });
    var h = min / 60, arr = I18N.hours[lang] || I18N.hours.he;
    return h === 1 ? arr[0] : (h === 2 ? arr[1] : arr[2].split('{n}').join(h % 1 ? h.toFixed(1) : h));
  }
  function renderPkg() {
    if (!S.pkg || !S.avail) return;
    var p = S.avail.pkg, ui = PKG_UI[S.pkg];
    $('pkg-name').textContent = p.name;
    $('pkg-sub').textContent = ui.sub[lang] || ui.sub.he;
    $('pkg-price').textContent = fmtNum(p.price);
    $('pkg-sessions').textContent = ui.sessions === 1 ? t('session1') : t('sessions', { n: ui.sessions });
    $('pkg-net').textContent = t('net', { n: ui.net });
    $('pkg-dur').textContent = t('dur', { h: humanDuration(p.minutes) });
    $('pkg-deposit-note').textContent = p.depositAllowed ? t('depositOk') : t('depositNo');
    $('tile-full-sub').textContent = t('fullSub', { n: fmtNum(p.price) });
    $('tile-deposit-sub').textContent = t('depSub', { n: fmtNum(p.price - p.deposit) });
    $('tile-deposit').hidden = !p.depositAllowed;
    if (!p.depositAllowed) $('tile-full').querySelector('input').checked = true;
  }
  function renderPicker() {
    var list = $('pkg-picker-list'); list.innerHTML = '';
    PKG_ORDER.forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'pkg-pick';
      b.innerHTML = '<span>' + esc(PKG_UI[k].sub[lang] || PKG_UI[k].sub.he) + '</span><small>' + k.toUpperCase() + '</small>';
      b.addEventListener('click', function () { location.href = selfUrl(k); });
      list.appendChild(b);
    });
    show('pkg-picker', true); show('pkg-card', false); show('avail-loading', false);
  }
  var changeBtn = $('pkg-change');
  if (changeBtn) changeBtn.addEventListener('click', function (e) { e.preventDefault(); renderPicker(); });

  /* ---------- availability + calendar ---------- */
  function availUrl() {
    var u = CONFIG.url + '?avail=' + encodeURIComponent(S.pkg) + '&_=' + Date.now();
    var h = S.hold || readHold(); if (h && h.bk) u += '&bk=' + encodeURIComponent(h.bk); // the customer's own hold never blocks them
    return u;
  }
  function loadAvailability() {
    show('avail-loading', true); show('avail-error', false); show('calendar', false); show('avail-closed', false);
    fetch(availUrl(), { redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) throw new Error(j.error || 'avail');
        S.avail = j; S.dayMap = {}; j.days.forEach(function (d) { S.dayMap[d.d] = d.slots; });
        S.serverOffsetMs = wall(j.serverNow) - Date.now();
        show('pkg-card', true); show('pkg-picker', false); renderPkg(); renderSummary();
        show('avail-loading', false);
        if (!j.bookingOpen) { show('avail-closed', true); return; }
        var first = j.days.length ? j.days[0].d : j.serverNow.slice(0, 10);
        S.month = first.slice(0, 7); renderCalendar(); show('calendar', true);
      })
      .catch(function () { show('avail-loading', false); show('avail-error', true); });
  }
  function monthLabel(ym) { var d = new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7) - 1, 1)); return d.toLocaleDateString({ he: 'he-IL', en: 'en-GB', ru: 'ru-RU', ar: 'ar' }[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' }); }
  function renderCalendar() {
    if (!S.month || !S.avail) return;
    var names = I18N.days[lang] || I18N.days.he;
    $('day-names').innerHTML = names.map(function (n) { return '<span>' + n + '</span>'; }).join('');
    $('cal-month').textContent = monthLabel(S.month);
    var y = +S.month.slice(0, 4), m = +S.month.slice(5, 7);
    var first = new Date(Date.UTC(y, m - 1, 1)), firstDow = first.getUTCDay(), daysIn = new Date(Date.UTC(y, m, 0)).getUTCDate();
    var grid = $('day-grid'); grid.innerHTML = ''; var anyInMonth = false;
    for (var i = 0; i < firstDow; i++) { var pad = document.createElement('button'); pad.type = 'button'; pad.className = 'day pad'; pad.disabled = true; grid.appendChild(pad); }
    for (var d = 1; d <= daysIn; d++) {
      var ymd = S.month + '-' + ('0' + d).slice(-2);
      if (S.dayMap[ymd]) anyInMonth = true;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'day' + (S.dayMap[ymd] ? ' has' : '') + (S.date === ymd ? ' selected' : '');
      b.textContent = d; b.disabled = !S.dayMap[ymd]; b.setAttribute('data-d', ymd);
      b.addEventListener('click', function () { S.date = this.getAttribute('data-d'); S.time = null; renderCalendar(); renderSlots(); renderChosen(); });
      grid.appendChild(b);
    }
    var months = Object.keys(S.dayMap).map(function (k) { return k.slice(0, 7); }).sort();
    $('cal-prev').disabled = !months.length || S.month <= months[0];
    $('cal-next').disabled = !months.length || S.month >= months[months.length - 1];
    renderSlots(anyInMonth);
  }
  function shiftMonth(delta) { var y = +S.month.slice(0, 4), m = +S.month.slice(5, 7) - 1 + delta; var d = new Date(Date.UTC(y, m, 1)); S.month = d.toISOString().slice(0, 7); renderCalendar(); }
  $('cal-prev').addEventListener('click', function () { shiftMonth(-1); });
  $('cal-next').addEventListener('click', function () { shiftMonth(1); });
  function renderSlots(anyInMonth) {
    var g = $('slot-grid'); g.innerHTML = '';
    if (!S.date) { g.innerHTML = '<span class="slot-empty">' + esc(anyInMonth === false ? t('noMonth') : t('pickDay')) + '</span>'; show('slot-title', false); return; }
    var slots = S.dayMap[S.date] || [];
    show('slot-title', true);
    if (!slots.length) { g.innerHTML = '<span class="slot-empty">' + esc(t('noSlots')) + '</span>'; return; }
    slots.forEach(function (hm) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'slot' + (S.time === hm ? ' selected' : ''); b.textContent = hm;
      b.addEventListener('click', function () { S.time = hm; renderSlots(); renderChosen(); $('booking-form').querySelector('[data-error="slot"]').classList.remove('show'); });
      g.appendChild(b);
    });
  }
  function renderChosen() {
    var ok = S.date && S.time && S.avail;
    show('chosen', !!ok);
    if (ok) { var txt = t('chosen', { d: ddmmyyyy(S.date), t: S.time, e: addMin(S.time, S.avail.pkg.minutes) }); $('chosen').textContent = txt; $('chosen2').textContent = txt; }
  }

  /* ---------- steps + summary ---------- */
  function scrollToForm() { var f = document.querySelector('.book-form'); if (f) window.scrollTo({ top: f.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' }); }
  function showStep(n) {
    document.querySelectorAll('.form-step').forEach(function (f) { f.classList.toggle('active', +f.getAttribute('data-step') === n); });
    document.querySelectorAll('.progress-step').forEach(function (p) { var s = +p.getAttribute('data-step'); p.classList.toggle('active', s === n); p.classList.toggle('done', s < n); });
    scrollToForm();
  }
  function payMode() { var r = document.querySelector('input[name="payMode"]:checked'); return r ? r.value : 'full'; }
  function renderSummary() {
    if (!S.avail) return; var p = S.avail.pkg; var dep = payMode() === 'deposit' && p.depositAllowed; var now = dep ? p.deposit : p.price;
    $('sum-price').textContent = fmtNum(p.price) + ' ₪'; $('sum-later').textContent = fmtNum(p.price - now) + ' ₪'; $('sum-now').textContent = fmtNum(now) + ' ₪';
  }
  document.querySelectorAll('input[name="payMode"]').forEach(function (r) { r.addEventListener('change', renderSummary); });
  document.querySelectorAll('.btn-next').forEach(function (b) { b.addEventListener('click', function () {
    if (!(S.date && S.time)) { $('booking-form').querySelector('[data-error="slot"]').classList.add('show'); return; }
    renderChosen(); renderSummary(); showStep(2);
  }); });
  document.querySelectorAll('.btn-back').forEach(function (b) { b.addEventListener('click', function () { showStep(1); }); });
  function validateStep2() {
    var ok = true;
    ['fullName', 'phone', 'email'].forEach(function (n) {
      var el = document.querySelector('[name="' + n + '"]'); if (n === 'phone') el.value = el.value.replace(/[\s-]/g, '');
      var valid = el.checkValidity() && (n !== 'phone' || /^05\d{8}$/.test(el.value)) && (n !== 'email' || !/[<>]/.test(el.value));
      el.classList.toggle('invalid', !valid); document.querySelector('[data-error="' + n + '"]').classList.toggle('show', !valid); if (!valid) ok = false;
    });
    return ok;
  }
  document.getElementById('booking-form').addEventListener('input', function (e) { if (e.target.name) { e.target.classList.remove('invalid'); var m = document.querySelector('[data-error="' + e.target.name + '"]'); if (m) m.classList.remove('show'); } });

  /* ---------- submit -> hold -> CardCom ---------- */
  function submit(existingPayload) {
    if (S.submitting) return; S.submitting = true;
    var btn = $('submit-btn'), orig = btn.textContent; btn.disabled = true; btn.textContent = t('sending');
    var f = $('booking-form');
    var payload = existingPayload || { formType: 'booking', pkg: S.pkg, date: S.date, time: S.time, payMode: payMode(), fullName: f.fullName.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), website: f.website.value, lang: lang, userAgent: navigator.userAgent };
    payload.lang = lang;
    var own = S.hold || readHold(); if (own && own.bk) payload.bk = own.bk; else delete payload.bk; // proof of ownership for retry and rebook
    postJson(payload)
      .then(function (res) {
        if (res.ok && res.code === 'ignored') { hideFormViews(); show('view-pending', true); show('pending-long', true); S.submitting = false; return; } // honeypot: quiet exit, no WhatsApp
        if (!res.ok && res.code === 'paid') { pollStatus(payload.bk || (own && own.bk) || '', 'success'); S.submitting = false; return; }
        if (!res.ok) { var err = new Error(res.error || 'generic'); err.code = res.code || 'generic'; err.waitMin = res.waitMin; throw err; }
        if (!res.lpUrl || !/^https:\/\/secure\.cardcom\.solutions\//.test(res.lpUrl)) { var e2 = new Error('cardcom'); e2.code = 'cardcom'; throw e2; }
        S.hold = { bk: res.bk, expiresAt: res.expiresAt, serverNow: res.serverNow, receivedAt: Date.now(), lpUrl: res.lpUrl, payload: payload, pkg: payload.pkg, pkgName: res.pkg, date: res.date, time: res.time, endTime: res.endTime, amount: res.amount, price: res.price, mode: res.mode };
        try { sessionStorage.setItem('dksBk', JSON.stringify(S.hold)); } catch (e) {}
        f.hidden = true; document.querySelector('.form-progress').hidden = true;
        show('view-hold', true); $('hold-manual-link').href = res.lpUrl;
        startTimer('timer-hold', S.hold, null);
        setTimeout(function () { location.href = res.lpUrl; }, 1500);
      })
      .catch(function (err) {
        S.submitting = false; btn.disabled = false; btn.textContent = orig;
        var code = err && err.code && I18N.err[err.code] ? err.code : 'generic';
        var waText = (code === 'cardcom' || code === 'generic' || code === 'rate') ? t('waHelp', { p: S.avail ? S.avail.pkg.name : '', d: S.date ? ddmmyyyy(S.date) : '', t: S.time || '', n: payload.fullName, ph: payload.phone }) : '';
        showError(code, { m: err && err.waitMin ? err.waitMin : 60 }, waText);
        if (code === 'slot_taken' || code === 'slot' || code === 'active_hold' || code === 'busy') { S.date = null; S.time = null; renderChosen(); showStep(1); loadAvailability(); }
        else if (!Object.keys(S.dayMap).length) { showStep(1); loadAvailability(); }
        if (code === 'phone' || code === 'email') { var el = document.querySelector('[name="' + code + '"]'); if (el) { el.classList.add('invalid'); } var m = document.querySelector('[data-error="' + code + '"]'); if (m) m.classList.add('show'); }
      });
  }
  $('booking-form').addEventListener('submit', function (e) { e.preventDefault(); if (!validateStep2()) return; if (!(S.date && S.time)) { showStep(1); return; } submit(null); });

  /* ---------- 13-minute timer ---------- */
  function startTimer(elId, hold, onExpire) {
    if (S.timerId) clearInterval(S.timerId);
    var el = $(elId); if (!el || !hold || !hold.expiresAt || !wall(hold.expiresAt)) { if (el) el.textContent = '--:--'; return; }
    var remainingAtReceive = wall(hold.expiresAt) - wall(hold.serverNow || hold.expiresAt);
    function tick() {
      var left = remainingAtReceive - (Date.now() - hold.receivedAt);
      if (left <= 0) { el.textContent = '00:00'; clearInterval(S.timerId); if (onExpire) onExpire(); return; }
      var s = Math.floor(left / 1000); el.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
      el.classList.toggle('warn', left < 120000);
    }
    tick(); S.timerId = setInterval(tick, 500);
  }

  /* ---------- release my own hold (instant, no approval) ---------- */
  function releaseHold(bk, cb) {
    if (!bk) { clearHold(); cb(true); return; }
    postJson({ formType: 'booking', action: 'release', bk: bk })
      .then(function (res) { if (res && res.code === 'paid') { cb(false); return; } clearHold(); cb(!!(res && (res.ok || res.code === 'missing'))); })
      .catch(function () { clearHold(); cb(false); });
  }
  function pickAgain() {
    var h = S.hold || readHold(); var bk = h && h.bk ? h.bk : (params.get('bk') || '');
    var pkg = (h && h.pkg) || params.get('pkg') || S.pkg || '';
    releaseHold(bk, function () { location.href = selfUrl(pkg); });
  }
  ['pick-again-btn', 'released-pick-btn', 'resume-pick-btn'].forEach(function (id) { var b = $(id); if (b) b.addEventListener('click', pickAgain); });
  var cancelBtn = $('resume-cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', function () {
    var h = S.hold || readHold(); var label = cancelBtn.textContent; cancelBtn.disabled = true; cancelBtn.textContent = t('releasing');
    releaseHold(h && h.bk, function (ok) {
      if (!ok) { cancelBtn.disabled = false; cancelBtn.textContent = label; showError('generic', null, ''); return; }
      showBanner('released');
      setTimeout(function () { location.href = selfUrl((h && h.pkg) || S.pkg || ''); }, 900);
    });
  });

  /* ---------- return from CardCom ---------- */
  function hideFormViews() { $('booking-form').hidden = true; document.querySelector('.form-progress').hidden = true; ['view-hold', 'view-pending', 'view-success', 'view-failed', 'view-released', 'view-resume'].forEach(function (v) { show(v, false); }); }
  function renderConfirmed(st) {
    hideFormViews(); show('view-success', true);
    var pay = st.mode === 'deposit' ? t('paidDep', { a: fmtNum(st.amount), l: fmtNum(st.price - st.amount) }) : t('paidFull', { a: fmtNum(st.amount) });
    $('confirm-box').innerHTML = t('confirm', { p: esc(st.pkg), d: ddmmyyyy(st.date), t: st.time, e: st.endTime, pay: pay, bk: esc(st.bk) });
    clearHold();
  }
  function pollStatus(bk, status) {
    var tries = 0, cached = readHold();
    function once() {
      tries++;
      fetch(CONFIG.url + '?bk=' + encodeURIComponent(bk) + '&_=' + Date.now(), { redirect: 'follow' }).then(function (r) { return r.json(); }).then(function (st) {
        if (st.state === 'confirmed') { renderConfirmed(st); return; }
        if (st.state === 'released' || st.state === 'missing' || st.state === 'dropped' || st.state === 'released_manual') { clearHold(); hideFormViews(); show('view-released', true); return; }
        if (status === 'success') {
          hideFormViews(); show('view-pending', true);
          if (tries >= 15) { show('pending-long', true); var rb = $('pending-recheck'); if (rb) { rb.hidden = false; rb.onclick = function () { rb.hidden = true; show('pending-long', false); tries = 0; once(); }; } return; }
          setTimeout(once, 4000); return;
        }
        // failed / cancel: the hold is still alive; offer retry, another slot, or help
        renderFailed(st, status, cached, bk);
      }).catch(function () {
        if (status === 'success' && tries < 15) { setTimeout(once, 4000); return; }
        if (status === 'success') { hideFormViews(); show('view-pending', true); show('pending-long', true); return; }
        renderFailed(null, status, cached, bk); // status fetch failed: still let the customer retry
      });
    }
    once();
  }
  function renderFailed(st, status, cached, bk) {
    hideFormViews(); show('view-failed', true);
    S.lastStatus = status;
    $('failed-title').textContent = status === 'cancel' ? t('cancelTitle') : t('failedTitle');
    var hold = (cached && cached.bk === bk) ? cached : null;
    var remaining = st && st.expiresAt ? (wall(st.expiresAt) - wall(st.serverNow || st.expiresAt)) : 0;
    if (st && remaining > 0) startTimer('timer-failed', { expiresAt: st.expiresAt, serverNow: st.serverNow, receivedAt: Date.now() }, function () { hideFormViews(); show('view-released', true); });
    else { if (S.timerId) clearInterval(S.timerId); $('timer-failed').textContent = '--:--'; } // the hold is kept for you (Paul decides), the timer just ended
    $('retry-btn').onclick = function () {
      if (hold && hold.payload) { hold.payload.bk = bk; S.submitting = false; hideFormViews(); $('booking-form').hidden = false; document.querySelector('.form-progress').hidden = false; submit(hold.payload); }
      else location.href = selfUrl(params.get('pkg') || S.pkg || ''); // no session memory: back to the form without releasing anything
    };
  }

  /* ---------- resume a live hold (page reload, back button, new tab) ---------- */
  function renderResume() {
    var h = S.resume; if (!h) return;
    var txt = t('resumeChosen', { p: h.pkgName || '', d: h.date ? ddmmyyyy(h.date) : '', t: h.time || '' });
    var el = $('resume-chosen'); if (el) el.textContent = txt;
  }
  function tryResume() {
    var h = readHold(); if (!h || !h.bk || !h.expiresAt || !h.lpUrl) return false;
    var remaining = (wall(h.expiresAt) - wall(h.serverNow || h.expiresAt)) - (Date.now() - (h.receivedAt || Date.now()));
    if (remaining <= 0) { clearHold(); return false; }
    S.hold = h; S.resume = h; S.pkg = PKG_UI[h.pkg] ? h.pkg : S.pkg;
    hideFormViews(); show('view-resume', true); renderResume();
    var pay = $('resume-pay-link'); if (pay) pay.href = h.lpUrl;
    startTimer('timer-resume', { expiresAt: h.expiresAt, serverNow: h.serverNow, receivedAt: h.receivedAt }, function () { hideFormViews(); show('view-released', true); });
    if (S.pkg) fetch(availUrl(), { redirect: 'follow' }).then(function (r) { return r.json(); }).then(function (j) { if (j.ok) { S.avail = j; show('pkg-card', true); show('pkg-picker', false); renderPkg(); } }).catch(function () {});
    show('avail-loading', false);
    return true;
  }
  window.addEventListener('pageshow', function (e) { if (e.persisted) location.reload(); }); // bfcache: never show a stale hold screen

  /* ---------- init ---------- */
  applyLanguage(lang);
  var status = params.get('status'), bk = params.get('bk'), pkg = params.get('pkg');
  S.pkg = PKG_UI[pkg] ? pkg : null;
  if (bk && status) {
    showBanner(status);
    hideFormViews();
    if (S.pkg) { fetch(availUrl(), { redirect: 'follow' }).then(function (r) { return r.json(); }).then(function (j) { if (j.ok) { S.avail = j; show('pkg-card', true); show('pkg-picker', false); renderPkg(); } }).catch(function () {}); }
    show('avail-loading', false);
    pollStatus(bk, status);
  } else if (tryResume()) {
    // a live hold from this session is shown with pay / pick another / cancel
  } else if (S.pkg) {
    loadAvailability();
  } else {
    renderPicker();
  }
})();

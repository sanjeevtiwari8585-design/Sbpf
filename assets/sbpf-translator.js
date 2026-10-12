/* SBPF multilingual translator — progressive enhancement.
 * Translation is provided by Google's hosted website translation widget.
 * Do not translate member records, form values, payment data, or private documents.
 */
(function () {
  'use strict';
  if (window.__sbpfTranslatorLoaded) return;
  window.__sbpfTranslatorLoaded = true;

  var languages = [
    ['hi', 'हिन्दी'], ['en', 'English'], ['as', 'অসমীয়া'], ['bn', 'বাংলা'],
    ['gu', 'ગુજરાતી'], ['kn', 'ಕನ್ನಡ'], ['ml', 'മലയാളം'], ['mr', 'मराठी'],
    ['ne', 'नेपाली'], ['or', 'ଓଡ଼ିଆ'], ['pa', 'ਪੰਜਾਬੀ'], ['sa', 'संस्कृतम्'],
    ['sd', 'سنڌي'], ['ta', 'தமிழ்'], ['te', 'తెలుగు'], ['ur', 'اردو']
  ];
  var style = document.createElement('style');
  style.textContent = [
    '#sbpf-language-tools{position:fixed;right:14px;bottom:14px;z-index:99999;display:flex;align-items:center;gap:7px;padding:8px 10px;background:#fff;border:1px solid #d8c9ad;border-radius:14px;box-shadow:0 5px 24px #0002;color:#29222a;font:600 13px/1.3 system-ui,sans-serif}',
    '#sbpf-language-tools label{white-space:nowrap}',
    '#sbpf-language-select{max-width:155px;border:1px solid #c9bda9;border-radius:9px;background:#fff;color:#29222a;padding:8px 9px;font:inherit}',
    '#sbpf-translate-status{position:fixed;right:14px;bottom:66px;z-index:99999;max-width:260px;padding:8px 10px;background:#fff8df;border:1px solid #ead49a;border-radius:10px;color:#51421e;font:12px/1.4 system-ui,sans-serif;display:none}',
    '.goog-te-banner-frame.skiptranslate{display:none!important}body{top:0!important}#google_translate_element{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip-path:inset(50%)!important}',
    '@media(max-width:480px){#sbpf-language-tools{right:8px;bottom:8px;padding:6px 8px}#sbpf-language-select{max-width:130px}}'
  ].join('');
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'sbpf-language-tools';
  wrap.innerHTML = '<label for="sbpf-language-select">🌐 भाषा / Language</label><select id="sbpf-language-select" aria-label="Choose page language"><option value="">भाषा चुनें</option></select>';
  var status = document.createElement('div');
  status.id = 'sbpf-translate-status';
  status.setAttribute('role', 'status');
  status.textContent = 'अनुवाद सेवा लोड हो रही है…';
  var hidden = document.createElement('div');
  hidden.id = 'google_translate_element';
  document.body.appendChild(wrap);
  document.body.appendChild(status);
  document.body.appendChild(hidden);

  var select = wrap.querySelector('select');
  languages.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item[0];
    option.textContent = item[1];
    select.appendChild(option);
  });

  function showStatus(message) {
    status.textContent = message;
    status.style.display = 'block';
    window.setTimeout(function () { status.style.display = 'none'; }, 5000);
  }
  select.addEventListener('change', function () {
    var code = select.value;
    if (!code) return;
    var combo = document.querySelector('.goog-te-combo');
    if (!combo) {
      showStatus('अनुवाद सेवा अभी उपलब्ध नहीं है। पेज को रीफ़्रेश करके फिर प्रयास करें।');
      return;
    }
    combo.value = code;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
    if (code === 'hi') {
      var reset = document.querySelector('.goog-te-combo');
      if (reset) { reset.value = 'hi'; reset.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  });

  window.googleTranslateElementInit = function () {
    if (!window.google || !google.translate || !google.translate.TranslateElement) {
      showStatus('अनुवाद सेवा लोड नहीं हो सकी।');
      return;
    }
    new google.translate.TranslateElement({
      pageLanguage: 'hi',
      includedLanguages: languages.map(function (x) { return x[0]; }).join(','),
      autoDisplay: false,
      multilanguagePage: true
    }, 'google_translate_element');
    select.addEventListener('focus', function () {
      if (!document.querySelector('.goog-te-combo')) {
        showStatus('अनुवाद विकल्प तैयार हो रहे हैं…');
      }
    }, { once: true });
  };

  var script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.onerror = function () { showStatus('अनुवाद सेवा तक कनेक्शन नहीं हो सका।'); };
  document.head.appendChild(script);
})();
/* SBPF reusable full-card social sharing. Uses the existing Supabase share-event table. */
(() => {
  'use strict';
  const SUPABASE_URL = 'https://dxowhzghrdghfzoggorx.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo';
  const SHARE_API = SUPABASE_URL + '/rest/v1/sbpf_card_social_shares';
  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const esc = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const slugify = value => clean(value).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 110) || 'card';

  function record(type, slug, title, platform) {
    fetch(SHARE_API, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ card_type: type, card_slug: slug, card_title: clean(title).slice(0, 240), platform }),
      keepalive: true
    }).catch(() => {});
  }

  function drawWrapped(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = clean(text).split(' ');
    let line = '', lines = [];
    for (const word of words) {
      const next = line ? line + ' ' + word : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line); line = word;
        if (lines.length >= maxLines) break;
      } else line = next;
    }
    if (line && lines.length < maxLines) lines.push(line);
    lines.forEach((part, i) => ctx.fillText(part, x, y + i * lineHeight, maxWidth));
    return y + lines.length * lineHeight;
  }

  async function makeCardImage({ title, description, link, imageUrl }) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
    bg.addColorStop(0, '#781626'); bg.addColorStop(1, '#145a38');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1350);
    ctx.fillStyle = '#fffdf7'; ctx.fillRect(34, 34, 1012, 1282);
    ctx.fillStyle = '#781626'; ctx.fillRect(34, 34, 1012, 118);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText('स्वर्णिम भारत परिवार फाउंडेशन', 68, 108, 940);
    let y = 190;
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' });
        if (!response.ok) throw new Error('image unavailable');
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        const maxW = 930, maxH = 550;
        const scale = Math.min(maxW / bitmap.width, maxH / bitmap.height);
        const w = bitmap.width * scale, h = bitmap.height * scale;
        ctx.drawImage(bitmap, (1080 - w) / 2, y, w, h);
        y += h + 36;
        bitmap.close?.();
      } catch (_) {
        ctx.fillStyle = '#f4e8d7'; ctx.fillRect(72, y, 936, 150);
        ctx.fillStyle = '#781626'; ctx.font = 'bold 40px system-ui, sans-serif';
        ctx.fillText('SBPF • सेवा • सहयोग', 100, y + 92);
        y += 188;
      }
    } else {
      ctx.fillStyle = '#f4e8d7'; ctx.fillRect(72, y, 936, 150);
      ctx.fillStyle = '#781626'; ctx.font = 'bold 40px system-ui, sans-serif';
      ctx.fillText('SBPF • सेवा • सहयोग', 100, y + 92);
      y += 188;
    }
    ctx.fillStyle = '#781626'; ctx.font = 'bold 48px system-ui, sans-serif';
    y = drawWrapped(ctx, title, 76, y, 928, 62, 2) + 20;
    ctx.fillStyle = '#343034'; ctx.font = '30px system-ui, sans-serif';
    y = drawWrapped(ctx, description || 'सेवा • सहयोग • स्वावलंबन • सशक्तिकरण', 76, y, 928, 46, 4) + 24;
    ctx.fillStyle = '#145a38'; ctx.font = 'bold 25px system-ui, sans-serif';
    drawWrapped(ctx, 'पूरी जानकारी: ' + link, 76, Math.min(1195, Math.max(y, 1120)), 928, 34, 2);
    ctx.fillStyle = '#b18b32'; ctx.fillRect(34, 1260, 1012, 56);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText('swarnimbharatclub.in  |  #SBPF', 76, 1298, 920);
    return await new Promise(resolve => canvas.toBlob(blob => {
      resolve(blob ? new File([blob], 'SBPF-' + slugify(title) + '.png', { type: 'image/png' }) : null);
    }, 'image/png'));
  }

  function attach(card) {
    if (!(card instanceof HTMLElement) || card.dataset.sbpfShareReady === '1') return;
    const heading = card.querySelector('h3, h2, [data-share-title]');
    const title = clean(card.dataset.shareTitle || heading?.textContent);
    if (!title) return;
    const description = clean(card.dataset.shareDescription || card.querySelector('p')?.textContent).slice(0, 650);
    const type = card.dataset.shareType || 'campaign_content';
    const slug = clean(card.dataset.shareSlug || card.id || slugify(title)).slice(0, 120);
    const image = card.dataset.shareImage || card.querySelector('img')?.currentSrc || card.querySelector('img')?.src || '';
    if (!card.id) card.id = 'sbpf-share-' + slugify(slug);
    const link = new URL(location.href);
    link.hash = card.id;
    const shareUrl = link.href;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sbpf-full-card-share';
    button.textContent = '↗ पूरा कार्ड शेयर करें';
    button.setAttribute('aria-label', title + ' — पूरा कार्ड शेयर करें');
    const status = document.createElement('p');
    status.className = 'sbpf-full-card-share-status';
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    const holder = document.createElement('div');
    holder.className = 'sbpf-full-card-share-holder';
    holder.append(button, status);
    const target = card.querySelector('.body') || card;
    target.append(holder);
    card.dataset.sbpfShareReady = '1';

    button.addEventListener('click', async () => {
      const text = '🌟 ' + title + ' | स्वर्णिम भारत परिवार फाउंडेशन (SBPF)\n' +
        (description ? description + '\n' : '') +
        'सेवा • सहयोग • स्वावलंबन • सशक्तिकरण\nपूरी जानकारी: ' + shareUrl +
        '\n#SBPF #SwarnimBharatParivar';
      button.disabled = true; status.hidden = false;
      status.textContent = 'पूरा कार्ड तैयार हो रहा है…';
      let file = null;
      try { file = await makeCardImage({ title, description, link: shareUrl, imageUrl: image }); } catch (_) {}
      try {
        if (file && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: title + ' | SBPF', text, url: shareUrl, files: [file] });
          status.textContent = 'पूरा कार्ड, विवरण और लिंक शेयर मेनू में भेज दिए गए।';
          record(type, slug, title, 'image_share');
        } else if (typeof navigator.share === 'function') {
          if (file) {
            const blobUrl = URL.createObjectURL(file);
            const a = document.createElement('a'); a.href = blobUrl; a.download = file.name; a.click();
            setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
          }
          await navigator.share({ title: title + ' | SBPF', text, url: shareUrl });
          status.textContent = file ? 'कार्ड PNG डाउनलोड हुआ; लिंक/विवरण शेयर हुए। जहाँ जरूरी हो PNG भी संलग्न करें।' : 'विवरण और लिंक शेयर हुए।';
          record(type, slug, title, 'text_share');
        } else {
          if (file) {
            const blobUrl = URL.createObjectURL(file);
            const a = document.createElement('a'); a.href = blobUrl; a.download = file.name; a.click();
            setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
          }
          await navigator.clipboard?.writeText(text);
          window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
          status.textContent = file ? 'कार्ड PNG डाउनलोड हुआ और WhatsApp खुल रहा है; तस्वीर संलग्न करें।' : 'WhatsApp में विवरण और लिंक खुल रहे हैं।';
          record(type, slug, title, 'whatsapp');
        }
      } catch (error) {
        if (error?.name === 'AbortError') status.textContent = 'शेयर रद्द किया गया।';
        else {
          try { await navigator.clipboard?.writeText(text); } catch (_) {}
          status.textContent = 'शेयर नहीं खुला। लिंक कॉपी करने के लिए कार्ड फिर दबाएँ।';
        }
      } finally { button.disabled = false; }
    });
  }

  function scan(root = document) {
    root.querySelectorAll?.('[data-sbpf-share-card], .sbpf-shareable-card').forEach(attach);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scan());
  else scan();
  const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) { if (node.matches?.('[data-sbpf-share-card], .sbpf-shareable-card')) attach(node); scan(node); }
  })));
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();

(() => {
  const BASE = 'https://dxowhzghrdghfzoggorx.supabase.co';
  const KEY = 'sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo';
  const $ = id => document.getElementById(id);
  const btn = $('renderVideo');
  if (!btn) return;
  const status = $('status');
  const say = (message, error = false) => {
    status.textContent = message;
    status.style.borderColor = error ? '#e35d6a' : '#263a55';
  };
  const authHeaders = token => ({ apikey: KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' });
  const splitCaptions = text => {
    const chunks = text.replace(/\s+/g, ' ').split(/(?<=[।!?])\s*/).map(s => s.trim()).filter(Boolean);
    return chunks.length ? chunks : [text.trim()];
  };
  const wrapText = (ctx, text, maxWidth) => {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      const next = line ? line + ' ' + word : word;
      if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = word; }
      else line = next;
    }
    if (line) lines.push(line);
    return lines;
  };
  const waitFor = (target, eventName, timeoutMs = 15000) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error('ऑडियो तैयार होने में समय समाप्त हुआ।')); }, timeoutMs);
    const cleanup = () => { clearTimeout(timer); target.removeEventListener(eventName, done); target.removeEventListener('error', failed); };
    const done = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error('ऑडियो लोड नहीं हो पाया।')); };
    target.addEventListener(eventName, done, { once: true });
    target.addEventListener('error', failed, { once: true });
  });
  async function render() {
    const source = window.swarnimRenderSource;
    const token = localStorage.getItem('sbpf_access_token');
    if (!token) { say('पहले SBPF सदस्य के रूप में लॉगिन करें।', true); location.href = 'member.html?return_to=swarnim-ai-studio.html'; return; }
    if (!source?.audioUrl || !source?.jobId) { say('पहले “स्टोरी + हिंदी वॉइसओवर सेव करें” पूरा करें।', true); return; }
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream || !window.AudioContext) {
      say('यह ब्राउज़र वीडियो रेंडर सपोर्ट नहीं करता। Android पर Chrome या डेस्कटॉप Chrome/Edge आज़माएँ।', true); return;
    }
    btn.disabled = true;
    const oldLabel = btn.textContent;
    btn.textContent = '⏳ वीडियो बन रहा है…';
    let audioUrl = null, outputUrl = null, audioContext = null, recorder = null, rafId = null;
    try {
      say('1/4 हिंदी ऑडियो लोड हो रहा है…');
      const audioResponse = await fetch(source.audioUrl);
      if (!audioResponse.ok) throw new Error('हिंदी ऑडियो डाउनलोड नहीं हुआ (' + audioResponse.status + ')।');
      const audioBlob = await audioResponse.blob();
      audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();
      audio.preload = 'auto';
      const metadataReady = waitFor(audio, 'loadedmetadata');
      audio.src = audioUrl;
      await metadataReady;
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) throw new Error('ऑडियो की अवधि पढ़ी नहीं जा सकी।');
      const ratio = source.ratio || '16:9';
      const dimensions = ratio === '9:16' ? [720, 1280] : ratio === '1:1' ? [720, 720] : [1280, 720];
      const width = dimensions[0], height = dimensions[1];
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('वीडियो कैनवास तैयार नहीं हुआ।');
      const captions = source.captions ? splitCaptions(source.script) : [];
      const weight = captions.reduce((sum, s) => sum + Math.max(1, s.length), 0);
      let acc = 0;
      const ranges = captions.map(text => {
        const start = acc / Math.max(1, weight) * audio.duration;
        acc += Math.max(1, text.length);
        return { text, start, end: acc / Math.max(1, weight) * audio.duration };
      });
      const draw = () => {
        const t = Math.max(0, audio.currentTime || 0), p = Math.min(1, t / audio.duration);
        const hue = (218 + Math.sin(t * 0.15) * 18 + 360) % 360;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'hsl(' + hue + ',57%,17%)');
        gradient.addColorStop(0.55, 'hsl(' + ((hue + 35) % 360) + ',54%,25%)');
        gradient.addColorStop(1, 'hsl(' + ((hue + 90) % 360) + ',48%,13%)');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
        const orbX = width * (0.18 + 0.64 * ((Math.sin(t * 0.21) + 1) / 2));
        const orbY = height * (0.22 + 0.2 * ((Math.cos(t * 0.17) + 1) / 2));
        const orb = ctx.createRadialGradient(orbX, orbY, 2, orbX, orbY, width * 0.38);
        orb.addColorStop(0, 'rgba(248,190,86,0.34)'); orb.addColorStop(1, 'rgba(248,190,86,0)');
        ctx.fillStyle = orb; ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255,255,255,0.055)';
        for (let i = 0; i < 9; i++) {
          const x = ((i * 173 + t * (12 + i)) % (width + 100)) - 50;
          const y = (i * 113 + height * 0.2) % height;
          ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3) * 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f6cf75';
        ctx.font = '700 ' + Math.max(18, width * 0.023) + 'px system-ui, sans-serif';
        ctx.fillText('SWARNIM BHARAT PARIVAR FOUNDATION', width / 2, height * 0.13);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 ' + Math.max(32, width * 0.052) + 'px system-ui, sans-serif';
        const titleLines = wrapText(ctx, source.title || 'स्वर्णिम भारत परिवार फाउंडेशन', width * 0.82).slice(0, 2);
        titleLines.forEach((line, i) => ctx.fillText(line, width / 2, height * 0.34 + i * height * 0.075));
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '600 ' + Math.max(16, width * 0.022) + 'px system-ui, sans-serif';
        ctx.fillText('सेवा  •  सहयोग  •  स्वावलंबन  •  सशक्तिकरण', width / 2, height * 0.51);
        const active = ranges.find(c => t >= c.start && t < c.end);
        if (active) {
          const lines = wrapText(ctx, active.text, width * 0.84).slice(0, 3);
          const lineHeight = Math.max(24, width * 0.033), boxH = lines.length * lineHeight + 42;
          const boxY = height * 0.68 - boxH / 2, boxW = width * 0.9, boxX = (width - boxW) / 2;
          ctx.fillStyle = 'rgba(4,10,20,0.72)';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 18);
          else ctx.rect(boxX, boxY, boxW, boxH);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 ' + Math.max(20, width * 0.027) + 'px system-ui, sans-serif';
          lines.forEach((line, i) => ctx.fillText(line, width / 2, boxY + 30 + lineHeight * (i + 0.75)));
        }
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(width * 0.08, height * 0.91, width * 0.84, Math.max(3, height * 0.004));
        ctx.fillStyle = '#f6cf75';
        ctx.fillRect(width * 0.08, height * 0.91, width * 0.84 * p, Math.max(3, height * 0.004));
        ctx.font = '600 ' + Math.max(13, width * 0.016) + 'px system-ui, sans-serif';
        ctx.fillStyle = '#ffffff'; ctx.fillText('राष्ट्रहित में 24×7 तत्पर', width / 2, height * 0.965);
        if (!audio.ended) rafId = requestAnimationFrame(draw);
      };
      audioContext = new AudioContext();
      await audioContext.resume();
      const audioSource = audioContext.createMediaElementSource(audio);
      const audioDestination = audioContext.createMediaStreamDestination();
      audioSource.connect(audioDestination); audioSource.connect(audioContext.destination);
      const canvasStream = canvas.captureStream(30);
      const combined = new MediaStream([...canvasStream.getVideoTracks(), ...audioDestination.stream.getAudioTracks()]);
      const mimeType = ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(type => MediaRecorder.isTypeSupported(type));
      if (!mimeType) throw new Error('इस ब्राउज़र में WebM वीडियो रिकॉर्डिंग समर्थित नहीं है।');
      const chunks = [];
      recorder = new MediaRecorder(combined, { mimeType: mimeType, videoBitsPerSecond: 2500000, audioBitsPerSecond: 128000 });
      const stopped = new Promise((resolve, reject) => {
        recorder.ondataavailable = event => { if (event.data && event.data.size) chunks.push(event.data); };
        recorder.onerror = () => reject(new Error('वीडियो रिकॉर्डिंग बीच में रुक गई।'));
        recorder.onstop = resolve;
      });
      draw();
      say('2/4 एनिमेटेड दृश्य, हिंदी कैप्शन और ऑडियो जोड़े जा रहे हैं…');
      recorder.start(1000);
      await audio.play();
      await new Promise((resolve, reject) => {
        audio.addEventListener('ended', resolve, { once: true });
        audio.addEventListener('error', () => reject(new Error('ऑडियो प्लेबैक विफल हुआ।')), { once: true });
      });
      if (rafId) cancelAnimationFrame(rafId);
      draw();
      await new Promise(resolve => setTimeout(resolve, 250));
      if (recorder.state !== 'inactive') recorder.stop();
      await stopped;
      combined.getTracks().forEach(track => track.stop());
      await audioContext.close(); audioContext = null;
      const outputMime = mimeType.split(';')[0];
      const extension = outputMime === 'video/mp4' ? 'mp4' : 'webm';
      const videoBlob = new Blob(chunks, { type: outputMime });
      if (!videoBlob.size) throw new Error('वीडियो फ़ाइल खाली बनी। कृपया फिर प्रयास करें।');
      outputUrl = URL.createObjectURL(videoBlob);
      say('3/4 वीडियो तैयार है (' + (videoBlob.size / 1024 / 1024).toFixed(1) + ' MB)। डाउनलोड शुरू हो रहा है…');
      const link = document.createElement('a');
      link.href = outputUrl;
      link.download = (source.title || 'swarnim-ai-video').replace(/[^\p{L}\p{N}-]+/gu, '-').slice(0, 60) + '.' + extension;
      document.body.appendChild(link); link.click(); link.remove();
      window.swarnimLastRenderedUrl = outputUrl;
      let cloudNote = 'वीडियो आपके डिवाइस में WebM फ़ाइल के रूप में डाउनलोड हुआ।';
      if (videoBlob.size <= 50 * 1024 * 1024) {
        try {
          say('4/4 निजी Supabase Storage में वीडियो सेव हो रहा है…');
          const userResponse = await fetch(BASE + '/auth/v1/user', { headers: authHeaders(token) });
          if (!userResponse.ok) throw new Error('सदस्य लॉगिन की पुष्टि नहीं हुई।');
          const user = await userResponse.json();
          const path = user.id + '/' + source.jobId + '.' + extension;
          const upload = await fetch(BASE + '/storage/v1/object/swarnim-video-exports/' + path.split('/').map(encodeURIComponent).join('/'), {
            method: 'POST',
            headers: { apikey: KEY, Authorization: 'Bearer ' + token, 'Content-Type': outputMime, 'x-upsert': 'true' },
            body: videoBlob
          });
          if (!upload.ok) throw new Error('Storage upload विफल (' + upload.status + '): ' + (await upload.text()).slice(0, 180));
          const patch = await fetch(BASE + '/rest/v1/sbpf_ai_video_jobs?id=eq.' + encodeURIComponent(source.jobId) + '&user_id=eq.' + encodeURIComponent(user.id), {
            method: 'PATCH',
            headers: { ...authHeaders(token), Prefer: 'return=minimal' },
            body: JSON.stringify({ video_url: 'storage://swarnim-video-exports/' + path, status: 'completed', completed_at: new Date().toISOString(), video_provider: 'browser-renderer', error_message: null })
          });
          if (!patch.ok) throw new Error('वीडियो सेव हुआ, लेकिन जॉब रिकॉर्ड अपडेट नहीं हुआ (' + patch.status + ')।');
          cloudNote = 'वीडियो डाउनलोड और निजी Supabase Storage में सेव हुआ। My Creations में रिकॉर्ड अपडेट किया गया।';
          if (typeof window.swarnimRefreshSavedJobs === 'function') await window.swarnimRefreshSavedJobs();
        } catch (error) { cloudNote += ' क्लाउड सेव नहीं हुआ: ' + (error.message || error) + ' डाउनलोड की फ़ाइल आपके पास सुरक्षित है।'; }
      } else cloudNote += ' फ़ाइल 50 MB से बड़ी है, इसलिए निजी क्लाउड अपलोड छोड़ दिया गया।';
      say('पूरा हुआ! ' + cloudNote);
    } catch (error) {
      say('वीडियो रेंडर नहीं हो पाया: ' + (error.message || error) + '। ऑडियो उपलब्ध हो तो दोबारा प्रयास करें।', true);
    } finally {
      if (rafId) cancelAnimationFrame(rafId);
      if (audioContext && audioContext.state !== 'closed') { try { await audioContext.close(); } catch {} }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      btn.disabled = false; btn.textContent = oldLabel;
    }
  }
  btn.addEventListener('click', render);
})();
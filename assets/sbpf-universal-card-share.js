/* SBPF universal full-card sharing, QR and share analytics. */
(() => {
  'use strict';
  if (window.__SBPF_UNIVERSAL_SHARE__) return;
  window.__SBPF_UNIVERSAL_SHARE__ = true;
  const API='https://dxowhzghrdghfzoggorx.supabase.co/rest/v1/sbpf_card_social_shares';
  const KEY='sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo';
  const SITE='https://swarnimbharatclub.in/';
  const SELECTOR='[data-sbpf-share-card],.sbpf-shareable-card,.campaign,.pillar,.info,.card,.service-card,.work-area-card,.focus-area-card,.project-card,.scheme-card,.benefit-card,.job-card,.opportunity-card,.feature-card,.content-card,.post-card,.media-card,.listing-card,.seva-card';
  const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
  const slugify=v=>clean(v).toLowerCase().replace(/[^\p{L}\p{N}-]+/gu,'-').replace(/^-|-$/g,'').slice(0,110)||'sbpf-card';
  const log=(type,slug,title,platform)=>{
    try{fetch(API,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({card_type:type,card_slug:slug,card_title:clean(title).slice(0,240),platform}),keepalive:true}).catch(()=>{});}catch(_){}
  };
  function detailLink(card,type,slug){
    const explicit=card.dataset.detailUrl||card.dataset.href||card.dataset.target;
    if(explicit){try{return new URL(explicit,location.href).href;}catch(_){}}
    const a=Array.from(card.querySelectorAll('a[href]')).find(x=>{
      const h=x.getAttribute('href')||'';return h&&!h.startsWith('#')&&!/^javascript:/i.test(h)&&!/^(mailto:|tel:)/i.test(h);
    });
    if(a){try{return new URL(a.getAttribute('href'),location.href).href;}catch(_){}}
    const special={'swarnim-book':'swarnim-book.html','swarnim-media':'swarnim-media/index.html','swarnim-creator':'swarnim-creator.html','swarnim-csc':'swarnim-csc.html'};
    if(type==='focus_area')return new URL('work-area.html?slug='+encodeURIComponent(slug),SITE).href;
    if(type==='campaign')return new URL(special[slug]||('campaign.html?slug='+encodeURIComponent(slug)),SITE).href;
    if(!card.id)card.id='sbpf-card-'+slugify(card.querySelector('h2,h3,h4')?.textContent||'card');
    const u=new URL(location.href);u.hash=card.id;return u.href;
  }
  function sharePath(type,slug){
    const safeType=slugify(type).replace(/-/g,'-');
    return SITE+'share/'+safeType+'/'+encodeURIComponent(slug)+'/';
  }
  function wrapped(ctx,text,x,y,maxWidth,lineHeight,maxLines,font){
    ctx.font=font;let line='',rows=[];
    for(const word of clean(text).split(' ')){const next=line?line+' '+word:word;
      if(ctx.measureText(next).width>maxWidth&&line){rows.push(line);line=word;if(rows.length>=maxLines)break;}else line=next;}
    if(line&&rows.length<maxLines)rows.push(line);rows.forEach((s,i)=>ctx.fillText(s,x,y+i*lineHeight,maxWidth));return y+rows.length*lineHeight;
  }
  async function makeImage(card,title,description,shareUrl){
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
    const ctx=canvas.getContext('2d');if(!ctx)return null;
    const g=ctx.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#781626');g.addColorStop(1,'#145a38');
    ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#fffdf7';ctx.fillRect(34,34,1012,1282);
    ctx.fillStyle='#781626';ctx.fillRect(34,34,1012,118);ctx.fillStyle='#fff';ctx.font='bold 36px system-ui';ctx.fillText('स्वर्णिम भारत परिवार फाउंडेशन',68,108,940);
    let y=190;const img=card.querySelector('img');
    if(img&&(img.currentSrc||img.src)){try{const im=new Image();im.crossOrigin='anonymous';im.src=img.currentSrc||img.src;
      await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;});const scale=Math.min(930/im.naturalWidth,520/im.naturalHeight);
      const w=im.naturalWidth*scale,h=im.naturalHeight*scale;ctx.drawImage(im,(1080-w)/2,y,w,h);y+=h+34;
    }catch(_){ctx.fillStyle='#f4e8d7';ctx.fillRect(72,y,936,145);ctx.fillStyle='#781626';ctx.font='bold 38px system-ui';ctx.fillText('SBPF • सेवा • सहयोग',100,y+88);y+=180;}}
    else{ctx.fillStyle='#f4e8d7';ctx.fillRect(72,y,936,145);ctx.fillStyle='#781626';ctx.font='bold 38px system-ui';ctx.fillText('SBPF • सेवा • सहयोग',100,y+88);y+=180;}
    ctx.fillStyle='#781626';y=wrapped(ctx,title,76,y,928,60,2,'bold 46px system-ui')+18;
    ctx.fillStyle='#343034';y=wrapped(ctx,description||'सेवा • सहयोग • स्वावलंबन • सशक्तिकरण',76,y,928,43,4,'28px system-ui')+24;
    ctx.fillStyle='#145a38';const linkY=y+30;wrapped(ctx,'पूरी जानकारी और QR: '+shareUrl,76,linkY,928,34,2,'bold 24px system-ui');
    const footerY=linkY+76;
    const finalHeight=Math.min(1700,Math.max(900,footerY+105));
    const output=document.createElement('canvas');output.width=1080;output.height=finalHeight;
    const out=output.getContext('2d');out.drawImage(canvas,0,0);
    out.fillStyle='#b18b32';out.fillRect(34,finalHeight-70,1012,70);out.fillStyle='#fff';out.font='bold 25px system-ui';out.fillText('swarnimbharatclub.in  |  #SBPF',76,finalHeight-27,920);
    return await new Promise(resolve=>output.toBlob(blob=>resolve(blob?new File([blob],'SBPF-'+slugify(title)+'.png',{type:'image/png'}):null),'image/png'));
  }
  async function copyText(value){try{await navigator.clipboard.writeText(value);return true;}catch(_){
    const box=document.createElement('textarea');box.value=value;box.style.cssText='position:fixed;opacity:0';document.body.appendChild(box);box.select();
    let ok=false;try{ok=document.execCommand('copy');}catch(e){}box.remove();return ok;}}
  function attach(card){
    if(!(card instanceof HTMLElement)||card.dataset.sbpfUniversalReady==='1')return;
    if(card.querySelector('.sbpf-card-share,.sbpf-full-card-share-holder,.sbpf-share-wrap,.sbpf-universal-share'))return;
    const heading=card.querySelector(':scope > h1,:scope > h2,:scope > h3,:scope > h4,[data-share-title]')||card.querySelector('h1,h2,h3,h4');
    const title=clean(card.dataset.shareTitle||heading?.textContent);if(!title)return;
    const description=clean(card.dataset.shareDescription||Array.from(card.querySelectorAll(':scope > p,p')).map(p=>p.textContent).join(' ')).slice(0,650);
    const grid=card.closest('#sbpfCampaignGrid,#sbpfFocusGrid');
    const type=card.dataset.shareType||(grid?.id==='sbpfCampaignGrid'?'campaign':grid?.id==='sbpfFocusGrid'?'focus_area':'campaign_content');
    const existingDetail=detailLink(card);
    let slug=clean(card.dataset.shareSlug||'');
    if(!slug){try{slug=new URL(existingDetail).searchParams.get('slug')||'';}catch(_){}}
    slug=slugify(slug||heading?.textContent||card.id||'sbpf-card');
    const detail=grid?.id==='sbpfFocusGrid'
      ? new URL('work-area.html?slug='+encodeURIComponent(slug),location.origin+'/').href
      : grid?.id==='sbpfCampaignGrid'
        ? new URL('campaign.html?slug='+encodeURIComponent(slug),location.origin+'/').href
        : existingDetail;
    if(!card.hasAttribute('data-sbpf-no-card-navigation')){
      card.style.cursor='pointer';
      card.setAttribute('tabindex',card.hasAttribute('tabindex')?card.getAttribute('tabindex'):'0');
      card.setAttribute('role',card.getAttribute('role')||'link');
      const openCard=event=>{
        if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        if(event.target.closest('a,button,input,select,textarea,summary,[contenteditable="true"],.sbpf-universal-share'))return;
        location.href=detail;
      };
      card.addEventListener('click',openCard);
      card.addEventListener('keydown',event=>{
        if((event.key==='Enter'||event.key===' ')&&event.target===card){event.preventDefault();location.href=detail;}
      });
      card.setAttribute('aria-label',(title||'SBPF कार्ड')+' — पूरी जानकारी खोलें');
    }
    
    if(!slug){try{slug=new URL(detail).searchParams.get('slug')||'';}catch(_){}}
    slug=slugify(slug||title);
    const shareUrl=sharePath(type,slug);
    const message='🌟 '+title+' | स्वर्णिम भारत परिवार फाउंडेशन (SBPF)\n'+(description?description+'\n':'')+
      'सेवा • सहयोग • स्वावलंबन • सशक्तिकरण\nपूरी जानकारी: '+shareUrl+'\n#SBPF #SwarnimBharatParivar';
    const qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data='+encodeURIComponent(shareUrl+'?src=qr');
    const wrap=document.createElement('div');wrap.className='sbpf-universal-share';wrap.style.cssText='display:flex;flex-wrap:wrap;gap:7px;margin-top:12px;width:100%';
    const status=document.createElement('p');status.setAttribute('aria-live','polite');status.style.cssText='width:100%;margin:2px 0 0;color:#315642;font-size:12px;line-height:1.5;overflow-wrap:anywhere';status.hidden=true;
    const note=s=>{status.hidden=false;status.textContent=s;};
    const btn=(label,fn)=>{const b=document.createElement('button');b.type='button';b.className='sbpf-card-share';b.textContent=label;
      b.style.cssText='flex:1 1 125px;min-height:42px;padding:9px 11px;border:1px solid #d5e5d8;border-radius:10px;background:#f0f8f1;color:#145a38;font:700 13px system-ui;cursor:pointer';b.addEventListener('click',fn);return b;};
    const qrPanel=document.createElement('div');qrPanel.hidden=true;qrPanel.style.cssText='width:100%;padding:12px;border:1px solid #dce8dc;border-radius:12px;background:#fff;text-align:center';
    const qr=document.createElement('img');qr.src=qrUrl;qr.alt='इस कार्ड की जानकारी खोलने के लिए QR कोड';qr.loading='lazy';qr.width=220;qr.height=220;qr.style.cssText='display:block;width:220px;height:220px;max-width:100%;margin:0 auto 8px;object-fit:contain';
    const qrCaption=document.createElement('div');qrCaption.textContent='स्कैन करके इस कार्ड की पूरी जानकारी खोलें';qrCaption.style.cssText='font-size:13px;color:#315642;font-weight:700';
    const qrLink=document.createElement('a');qrLink.href=qrUrl;qrLink.target='_blank';qrLink.rel='noopener';qrLink.textContent='QR कोड खोलें / डाउनलोड करें';qrLink.style.cssText='display:inline-block;margin-top:8px;color:#145a38;font-size:13px;font-weight:700';
    qrPanel.append(qr,qrCaption,qrLink);
    wrap.append(
      btn('↗ सभी ऐप पर शेयर',async()=>{try{const file=await makeImage(card,title,description,shareUrl);if(navigator.share){const data={title:title+' | SBPF',text:message,url:shareUrl};if(file&&navigator.canShare?.({files:[file]}))data.files=[file];await navigator.share(data);log(type,slug,title,file?'image_share':'share_sheet');note('कार्ड, विवरण और स्थायी लिंक शेयर मेनू में भेजे गए।');}else{await copyText(message);log(type,slug,title,'copy_link');note('जानकारी और स्थायी लिंक कॉपी हो गए। PNG डाउनलोड करके तस्वीर पोस्ट करें।');}}catch(e){note(e?.name==='AbortError'?'शेयर रद्द किया गया।':'शेयर मेनू नहीं खुला। WhatsApp या कॉपी विकल्प इस्तेमाल करें।');}}),
      btn('WhatsApp',()=>{window.open('https://wa.me/?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');log(type,slug,title,'whatsapp');note('WhatsApp में पूरा विवरण और कार्ड लिंक खुल रहा है।');}),
      btn('Facebook',()=>{window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(shareUrl),'_blank','noopener,noreferrer');log(type,slug,title,'facebook');note('Facebook शेयर विंडो खुल रही है।');}),
      btn('लिंक + विवरण कॉपी',async()=>{const ok=await copyText(message);if(ok){log(type,slug,title,'copy_link');note('पूरा विवरण और स्थायी लिंक कॉपी हो गए।');}else note('कॉपी नहीं हो सका।');}),
      btn('कार्ड PNG डाउनलोड',async()=>{try{const file=await makeImage(card,title,description,shareUrl);if(!file){note('कार्ड तस्वीर तैयार नहीं हो सकी।');return;}const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);note('पूरा कार्ड PNG डाउनलोड हो गया। QR कोड अलग से डाउनलोड करने के लिए QR विकल्प खोलें।');}catch(e){note('कार्ड डाउनलोड नहीं हो सका।');}}),
      btn('▦ QR कोड',()=>{qrPanel.hidden=!qrPanel.hidden;if(!qrPanel.hidden){log(type,slug,title,'qr_view');note('इस कार्ड का अलग QR कोड तैयार है।');}})
    );
    wrap.append(qrPanel,status);(card.querySelector(':scope > .body')||card).append(wrap);
    card.dataset.sbpfUniversalReady='1';
    card.style.cursor='pointer';
    if(!card.hasAttribute('tabindex'))card.setAttribute('tabindex','0');
    if(!card.hasAttribute('role'))card.setAttribute('role','link');
    const openCard=e=>{
      if(e.target.closest('a,button,input,select,textarea,label,[role="button"],.sbpf-universal-share'))return;
      if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;
      if(e.type==='keydown')e.preventDefault();
      if(detail&&detail!==location.href)location.href=detail;
    };
    card.addEventListener('click',openCard);
    card.addEventListener('keydown',openCard);
  }
  function scan(root=document){if(root instanceof HTMLElement&&root.matches(SELECTOR))attach(root);root.querySelectorAll?.(SELECTOR).forEach(attach);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>scan());else scan();
  if('MutationObserver'in window&&document.documentElement)new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n);}))).observe(document.documentElement,{childList:true,subtree:true});
})();
(() => {
  'use strict';
  const body=document.body;
  const type=body.dataset.cardType||'campaign_content';
  const slug=body.dataset.cardSlug||'sbpf-card';
  const title=body.dataset.cardTitle||document.title;
  const API='https://dxowhzghrdghfzoggorx.supabase.co/rest/v1/sbpf_card_social_shares';
  const KEY='sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo';
  const params=new URLSearchParams(location.search);
  const platform=params.get('src')==='qr'?'qr_scan':'link_click';
  try{fetch(API,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
    body:JSON.stringify({card_type:type,card_slug:slug,card_title:title.slice(0,240),platform}),keepalive:true}).catch(()=>{});}catch(_){}
  const target=body.dataset.target;
  const button=document.getElementById('sbpfOpenCard');
  if(button)button.addEventListener('click',()=>{
    try{fetch(API,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({card_type:type,card_slug:slug,card_title:title.slice(0,240),platform:'detail_click'}),keepalive:true}).catch(()=>{});}catch(_){}
    location.href=target;
  });
  if(target)window.setTimeout(()=>{location.href=target;},2600);
})();
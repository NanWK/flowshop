const flowers=[{id:1,name:'落日来信',en:'SUNSET LETTER · 玫瑰混合花束',price:268,category:'gift',tag:'THE FAVORITE',image:'photo-1563241527-3004b7be0ffd'},{id:2,name:'白日梦',en:'A DAYDREAM · 洋桔梗与尤加利',price:238,category:'daily',tag:'SLOW LIVING',image:'photo-1525310072745-f49212b5ac6d'},{id:3,name:'粉色心事',en:'A LITTLE CRUSH · 粉色牡丹与玫瑰',price:298,category:'gift',tag:'JUST FOR YOU',image:'photo-1526045478516-99145907023c'},{id:4,name:'春日放晴',en:'SUNNY SIDE · 郁金香自然花束',price:228,category:'daily',tag:'HELLO, SPRING',image:'photo-1490750967868-88aa4486c946'},{id:5,name:'向阳而生',en:'FOLLOW THE SUN · 向日葵花束',price:198,category:'daily',tag:'A LITTLE SUNSHINE',image:'photo-1470252649378-9c29740c9fa8'},{id:6,name:'云朵来信',en:'CLOUD NINE · 绣球与白玫瑰',price:328,category:'gift',tag:'MADE OF DREAMS',image:'photo-1494972308805-463bc619d34e'},{id:7,name:'轻声告白',en:'SWEET NOTHINGS · 小雏菊与洋甘菊',price:218,category:'gift',tag:'SAY IT WITH FLOWERS',image:'photo-1520763185298-1b434c919102'},{id:8,name:'晚风轻轻',en:'EVENING BREEZE · 康乃馨混搭花束',price:258,category:'daily',tag:'TAKE IT SLOW',image:'photo-1462275646964-a0e3386b89fa'}];let bag=[];try{bag=JSON.parse(localStorage.getItem('flora-bag')||'[]').filter(id=>flowers.some(f=>f.id===id))}catch{}const products=document.querySelector('#products');function render(filter='all'){products.innerHTML=flowers.filter(f=>filter==='all'||f.category===filter).map(f=>`<article class="product"><div class="product-image"><img loading="lazy" src="https://images.unsplash.com/${f.image}?auto=format&fit=crop&w=800&q=85" alt="${f.name}花束"><span class="tag">${f.tag}</span><button class="add" data-add="${f.id}" aria-label="将${f.name}加入花袋">＋</button></div><div class="product-title"><h3>${f.name}</h3><span>¥ ${f.price}</span></div><p>${f.en}</p></article>`).join('')}function update(){document.querySelector('#count').textContent=bag.length;try{localStorage.setItem('flora-bag',JSON.stringify(bag))}catch{}document.querySelector('#bag-items').innerHTML=bag.length?bag.map((id,i)=>{const f=flowers.find(f=>f.id===id);return `<div class="bag-row"><span>${f.name} · ¥${f.price}</span><button data-remove="${i}">移除</button></div>`}).join(''):'<p class="dialog-intro">花袋还是空的，先去挑一束喜欢的花吧。</p>';document.querySelector('#total').textContent=bag.length?'合计 ¥ '+bag.reduce((s,id)=>s+flowers.find(f=>f.id===id).price,0):''}document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)});let timer;products.onclick=e=>{const b=e.target.closest('[data-add]');if(!b)return;bag.push(Number(b.dataset.add));update();const toast=document.querySelector('#toast');toast.textContent='已加入心愿花袋 ✿';toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2200)};const drawer=document.querySelector('#drawer');document.querySelector('#bag').onclick=()=>drawer.showModal();document.querySelector('#close').onclick=()=>drawer.close();drawer.onclick=e=>{if(e.target===drawer){const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)drawer.close()}};document.querySelector('#bag-items').onclick=e=>{const b=e.target.closest('[data-remove]');if(b){bag.splice(Number(b.dataset.remove),1);update()}};const feeling=document.querySelector('#feeling');const feelingStatus=document.querySelector('#feeling-status');feeling.value=localStorage.getItem('flora-feeling')||'';feeling.addEventListener('input',()=>{try{if(feeling.value)localStorage.setItem('flora-feeling',feeling.value);else localStorage.removeItem('flora-feeling');feelingStatus.textContent='心意已保存在当前设备。'}catch{feelingStatus.textContent='无法保存心意，请检查浏览器的存储设置。'}});render();update();

const wishForm=document.querySelector('#wish-form');
const wishText=document.querySelector('#wish-text');
const wishList=document.querySelector('#wish-list');
const wishStatus=document.querySelector('#wish-status');
let wishes=[];
try{
 const saved=JSON.parse(localStorage.getItem('flora-wishes')||'[]');
 if(Array.isArray(saved)) wishes=saved.filter(w=>w&&typeof w.id==='string'&&typeof w.text==='string'&&w.text.trim()&&w.text.length<=200&&typeof w.done==='boolean');
}catch{wishStatus.textContent='暂时无法读取已存心愿，仍可在本次页面中许愿。'}
function renderWishes(){
 wishList.replaceChildren();
 if(!wishes.length){
  const empty=document.createElement('p');
  empty.className='wish-empty';
  empty.textContent='这里还没有心愿，种下第一颗期待吧。';
  wishList.append(empty);
 }
 wishes.forEach(w=>{
  const card=document.createElement('article');
  card.className='wish-card'+(w.done?' fulfilled':'');
  const label=document.createElement('span');
  label.className='wish-label';
  label.textContent=w.done?'✿ 心愿已开花':'✳ 等待花开';
  const content=document.createElement('p');
  content.textContent=w.text;
  const actions=document.createElement('div');
  actions.className='wish-card-actions';
  const toggle=document.createElement('button');
  toggle.type='button';
  toggle.textContent=w.done?'重新许愿':'标记已实现';
  toggle.setAttribute('aria-pressed',String(w.done));
  toggle.onclick=()=>{w.done=!w.done;saveWishes(w.done?'心愿已实现，愿美好继续。':'心愿已重新种下。');};
  const remove=document.createElement('button');
  remove.type='button';
  remove.textContent='删除';
  remove.setAttribute('aria-label','删除心愿：'+w.text);
  remove.onclick=()=>{wishes=wishes.filter(item=>item.id!==w.id);saveWishes('心愿已删除。');};
  actions.append(toggle,remove);
  card.append(label,content,actions);
  wishList.append(card);
 });
}
function saveWishes(message){
 try{
  localStorage.setItem('flora-wishes',JSON.stringify(wishes));
  wishStatus.textContent=message+' 已保存在当前浏览器。';
 }catch{wishStatus.textContent='浏览器无法保存，当前更改仅在本次页面有效，刷新后可能丢失。';}
 renderWishes();
}
wishForm.addEventListener('submit',event=>{
 event.preventDefault();
 const value=wishText.value.trim();
 if(!value){wishStatus.textContent='先写下一点心愿吧。';wishText.focus();return;}
 if(value.length>200){wishStatus.textContent='心愿请控制在 200 字以内。';return;}
 wishes.unshift({id:globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2),text:value,done:false});
 saveWishes('心愿已种下，期待它开花。');
 wishForm.reset();
 wishText.focus();
});
renderWishes();

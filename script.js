
function openCourse(){
  document.body.classList.add('course-open');
  const app=document.getElementById('courseApp');
  if(app) app.style.display='flex';
  openSection('intro');
}
document.getElementById('startCourse')?.addEventListener('click',openCourse);
document.getElementById('startCourseBottom')?.addEventListener('click',openCourse);

function syncLandingLang(lang){
  const lb=document.getElementById('landingLv'), rb=document.getElementById('landingRu');
  if(lb) lb.classList.toggle('active',lang==='lv');
  if(rb) rb.classList.toggle('active',lang==='ru');
}
document.getElementById('landingLv')?.addEventListener('click',()=>{setLang('lv');syncLandingLang('lv')});
document.getElementById('landingRu')?.addEventListener('click',()=>{setLang('ru');syncLandingLang('ru')});

let currentLang=localStorage.getItem('courseLang')||'lv';
const sections=[...document.querySelectorAll('.section')];
const nav=[...document.querySelectorAll('.nav')];
const visited=new Set(['intro']);

function setLang(lang){
  currentLang=lang;
  localStorage.setItem('courseLang',lang);
  document.documentElement.lang=lang;
  document.body.classList.toggle('lv',lang==='lv');
  document.body.classList.toggle('ru',lang==='ru');
  document.getElementById('ruBtn').classList.toggle('active',lang==='ru');
  document.getElementById('lvBtn').classList.toggle('active',lang==='lv');
  syncLandingLang(lang);
  renderProducts();
  renderLivePages();
  updateProgress();
}
document.getElementById('ruBtn').onclick=()=>setLang('ru');
document.getElementById('lvBtn').onclick=()=>setLang('lv');

function openSection(id){
 sections.forEach(s=>s.classList.toggle('active',s.id===id));
 nav.forEach(n=>n.classList.toggle('active',n.dataset.target===id));
 visited.add(id);
 updateProgress();
}
nav.forEach(n=>n.addEventListener('click',()=>openSection(n.dataset.target)));

function updateProgress(){
 const pct=Math.round(visited.size/sections.length*100);
 document.getElementById('progressFill').style.width=pct+'%';
 document.getElementById('progressText').textContent=pct+'%';
}

function miniCheck(id,correct){
 const chosen=document.querySelector(`input[name="${id}"]:checked`);
 const box=document.getElementById(`fb-${id}`);
 if(!chosen){
   box.textContent=currentLang==='ru'?'Выберите вариант ответа.':'Izvēlieties atbildi.';
   box.style.color='#91543e'; return;
 }
 if(chosen.value===correct){
   box.textContent=currentLang==='ru'?'✓ Верно.':'✓ Pareizi.';
   box.style.color='#486356';
 }else{
   box.textContent=currentLang==='ru'?'✗ Неверно. Повторите материал.':'✗ Nepareizi. Atkārtojiet materiālu.';
   box.style.color='#91543e';
 }
}

function caseCheck(btn,choice){
 const wrap=btn.closest('.case');
 const fb=wrap.querySelector('.case-feedback');
 if(choice===wrap.dataset.answer){
   fb.textContent=currentLang==='ru'?'✓ Лучший вариант.':'✓ Labākais variants.';
   fb.style.color='#486356';
 }else{
   fb.textContent=currentLang==='ru'?'✗ Попробуйте ещё раз.':'✗ Mēģiniet vēlreiz.';
   fb.style.color='#91543e';
 }
}

let activeFilter='all';
document.querySelectorAll('.filter').forEach(f=>f.addEventListener('click',()=>{
 document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
 f.classList.add('active'); activeFilter=f.dataset.filter; renderProducts();
}));

function productMatches(p){
 if(activeFilter==='all') return true;
 if(activeFilter==='Prosecco') return p.name.toLowerCase().includes('prosecco');
 if(activeFilter==='Cava') return p.cat.includes('Cava');
 if(activeFilter==='Crémant') return p.cat.includes('Crémant');
 if(activeFilter==='Champagne') return p.cat.includes('Champagne');
 if(activeFilter==='Latvia') return p.cat.includes('Latvija');
 if(activeFilter==='Sweet'){
   const st=(p.style||'').toLowerCase();
   return st.includes('sald') || st.includes('sweet') || st.includes('pussald') || st.includes('semi-sweet') || st.includes('demi-sec') || st.includes('semi seco') || st.includes('semiseco') || st.includes('pussauss') || st.includes('semi-dry');
 }
 return true;
}
function renderProducts(){
 const grid=document.getElementById('productGrid');
 if(!grid) return;
 const arr=window.PRODUCTS.filter(productMatches);
 grid.innerHTML=arr.map(p=>{
   const ruStyle=p.style.includes('sauss')?'Сухое':p.style.includes('pussauss')?'Полусухое':p.style.includes('salds')?'Сладкое':p.style;
   const ruNote={
    "Menestrello Prosecco 0,75L 11%":"Glera; свежий и освежающий стиль с цветочными и белоперсиковыми нотами. Подходит для аперитива, рыбы и холодных закусок.",
    "Canti Prosecco Ice 0,75 L":"Сухой Prosecco, лёгкий вариант к рыбе.",
    "Zonin Prosecco Cuvée 1821 0,75 L":"Glera; сухой яблочный профиль с цитрусовыми оттенками.",
    "Ville D'Arfanta Prosecco Millesimato 0,75 L":"Glera; сухой Prosecco для рыбы и салатов.",
    "Ville d'Arfanta Prosecco Millesimato Valdobbiadene 0,75 L":"Glera; очень сухой стиль Prosecco, хорошо подходит к рыбе и салатам.",
    "Premius Brut Crémant de Bordeaux 0,75 L":"Сухой французский Crémant на Cabernet Franc; хорошая альтернатива для клиента, который хочет французское игристое.",

    "Rīgas Oriģinālais dzirkstošais vīns 0,2L 11,5%":"Маленькая бутылка 0,2 л — удобный формат для индивидуальной порции.",
    "Rīgas Šampanietis Bruts 0,75 L":"В карточке VYNOTEKA указана Charmat-метода; можно предложить как доступный Brut.",
    "Brilla Prosecco Extra Dry 0,75 L":"Glera; лёгкий фруктовый стиль.",
    "Sant'Orsola Prosecco Extra Dry 0,75 L":"Лёгкий ароматный Prosecco.",
    "Montelvini Asolo Prosecco Extra Brut 0,75 L":"Более сухой стиль Prosecco.",
    "Corvezzo Organic Prosecco Valdobbiadene Brut 0,75 L":"Органический Prosecco из Valdobbiadene.",
    "Martini Prosecco DOC 0,75 L":"Свежий фруктовый профиль: яблоко, персик, цитрус.",
    "Martini Rosé D.O.C. 0,75 L":"Розовый, более ягодный и мягкий стиль.",
    "Martini Asti 0,75 L":"Сладкий, лёгкий, ароматный Moscato; хорошо с десертами.",
    "Martini Frizzante Semiseco 0,75 L":"Полусухой, мягкий вариант к закускам и десертам.",
    "Cava Jaume Serra Castelfino Brut 0,75 L":"Традиционный метод; хороший вариант для сравнения с Prosecco.",
    "Dom Potier Cava Demi Sec 0,75 L":"Более мягкий и сладкий Cava.",
    "Vilarnau Cava Ice Reserva 0,75 L":"Сухой Cava.",
    "Zinck Crémant d'Alsace Brut 0,75 L":"Французский Crémant с цитрусом, грушей и хлебными нотами.",
    "Zinck Crémant d'Alsace Rosé 0,75 L":"Розовый Crémant с ягодным профилем.",
    "Château Champteloup Crémant de Loire Brut 0,75 L":"Chardonnay + Chenin Blanc; белые цветы, персик, яблоко.",
    "Cremant de Bourgogne Diamant 0,75 L":"Chardonnay; сухой французский вариант.",
    "Moutard Crémant de Bourgogne Brut 0,75 L":"Традиционный метод; Chardonnay, Pinot Noir, Aligoté.",
    "Mumm Cordon Rouge Brut 0,75 L":"Champagne; классический премиальный пример."
   }[p.name]||p.note;
   const lvNote=p.note;
   return `<article class="product">
     <div class="product-top"><span class="pill">${p.cat}</span><span class="pill dark">${p.style}</span></div>
     <h3>${p.name}</h3>
     <p>${currentLang==='ru'?ruNote:lvNote}</p>
     <a href="${p.source}" target="_blank" rel="noopener" class="product-link">${currentLang==='ru'?'Открыть карточку VYNOTEKA →':'Atvērt VYNOTEKA kartīti →'}</a>
   </article>`;
 }).join('');
}
renderProducts();

function finishExam(){
 const qs=[...document.querySelectorAll('.q')];
 let score=0,answered=0;
 qs.forEach(q=>{
   q.classList.remove('correct','incorrect');
   const selected=q.querySelector('input:checked');
   if(selected){
     answered++;
     if(selected.value===q.dataset.a){score++;q.classList.add('correct')}
     else q.classList.add('incorrect');
   }
 });
 const pct=Math.round(score/qs.length*100);
 const r=document.getElementById('result');
 r.className='result '+(pct>=80?'pass':'fail');
 r.classList.remove('hidden');
 r.innerHTML=currentLang==='ru'
 ? `<div>Результат</div><div class="score">${pct}%</div><p><b>${score} из ${qs.length}</b> правильных ответов.</p><p>${answered<qs.length?'Отвечено: '+answered+' из '+qs.length+'. ':''}${pct>=80?'Курс пройден.':'Порог 80% не достигнут. Повторите материалы и пройдите тест ещё раз.'}</p>`
 : `<div>Rezultāts</div><div class="score">${pct}%</div><p><b>${score} no ${qs.length}</b> pareizām atbildēm.</p><p>${answered<qs.length?'Atbildēts: '+answered+' no '+qs.length+'. ':''}${pct>=80?'Kurss nokārtots.':'80% slieksnis nav sasniegts. Atkārtojiet materiālus un pildiet testu vēlreiz.'}</p>`;
 visited.add('exam'); updateProgress(); r.scrollIntoView({behavior:'smooth',block:'center'});
}
setLang(currentLang);

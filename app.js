'use strict';
const {questions,clean,check}=CyberGame;
const $=id=>document.getElementById(id);
const KEY='cyberelka.progress.v1';
let solved=[],storageOK=true,current=null,audio=null,musicTimer=null,soundOn=false,celebrated=false;
try{solved=clean(JSON.parse(localStorage.getItem(KEY)||'[]'));localStorage.setItem(KEY,JSON.stringify(solved));}catch{storageOK=false;}
const positions=[[50,34],[40,46],[62,51],[29,62],[51,66],[70,76],[39,80]];
questions.forEach((q,i)=>{
 const b=document.createElement('button');b.className='ornament';b.style.left=positions[i][0]+'%';b.style.top=positions[i][1]+'%';b.textContent=q.icon;b.id='orb-'+q.id;b.addEventListener('click',()=>openTask(q.id));$('ornaments').append(b);
 const li=document.createElement('li'),link=document.createElement('button');link.className='quest-link';link.id='link-'+q.id;link.innerHTML='<span class="quest-num">'+String(i+1).padStart(2,'0')+'</span><span></span>';link.lastElementChild.textContent=q.title;link.addEventListener('click',()=>openTask(q.id));li.append(link);$('mission-list').append(li);
});
function save(){try{localStorage.setItem(KEY,JSON.stringify(solved));}catch{storageOK=false;} $('storage-note').hidden=storageOK;}
function render(){
 const n=solved.length,complete=n===questions.length;
 $('count').innerHTML=n+' <span>/ 7</span>';$('progress-fill').style.width=(n/7*100)+'%';document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',n);
 questions.forEach((q,i)=>{const done=solved.includes(q.id),orb=$('orb-'+q.id),link=$('link-'+q.id);orb.classList.toggle('lit',done);orb.setAttribute('aria-label',(done?'Пройдено. ':'')+q.title);orb.title=q.title;orb.querySelector('.check')?.remove();if(done){const s=document.createElement('span');s.className='check';s.textContent='✓';s.setAttribute('aria-hidden','true');orb.append(s);}link.classList.toggle('completed',done);link.firstElementChild.textContent=done?'✓':String(i+1).padStart(2,'0');});
 $('tree-wrap').classList.toggle('complete-tree',complete);$('final').hidden=!complete;
 $('next').innerHTML=complete?'Смотреть поздравление <span>↗</span>':n?'Зажечь следующий огонёк <span>↗</span>':'Зажечь первый огонёк <span>↗</span>';
 $('mission-title').textContent=complete?'Праздник спасён!':'Верни празднику свет';$('mission-copy').textContent=complete?'Все семь испытаний пройдены. Забери открытку на память и пригласи друзей зажечь свою ёлку.':'КиберГринч погасил огни. За каждой игрушкой — цифровая ловушка. Раскрой её, и ёлка станет ярче.';
 $('storage-note').hidden=storageOK;
}
function openTask(id){
 current=id;const q=questions.find(x=>x.id===id),i=questions.indexOf(q),done=solved.includes(id);
 $('task-number').textContent='ИГРУШКА '+String(i+1).padStart(2,'0')+' / 07';$('task-icon').textContent=q.icon;$('task-title').textContent=q.title;$('task-text').textContent=q.text;$('answers').replaceChildren();$('feedback').hidden=true;$('task-done').hidden=true;
 q.answers.forEach((text,index)=>{const b=document.createElement('button');b.className='answer';b.textContent=text;b.disabled=done;if(done&&index===q.correct)b.classList.add('correct');b.addEventListener('click',()=>answer(q,index,b));$('answers').append(b);});
 if(done){$('feedback').textContent='✓ Этот огонёк уже горит. '+q.explanation;$('feedback').hidden=false;$('task-done').hidden=false;}
 $('task').showModal();$('close-task').focus();
}
function answer(q,index,button){
 if(solved.includes(q.id))return;
 $('feedback').hidden=false;
 if(!check(q.id,index)){button.classList.add('wrong');button.setAttribute('aria-label',q.answers[index]+'. Попробуй другой ответ');$('feedback').textContent='💡 '+q.hint;return;}
 solved.push(q.id);save();button.classList.add('correct');[...$('answers').children].forEach(b=>b.disabled=true);$('feedback').textContent='✦ Огонёк зажжён! '+q.explanation;$('task-done').hidden=false;render();$('live').textContent='Огонёк зажжён. Пройдено '+solved.length+' из 7.';chime();
}
function closeTask(){ $('task').close();if(solved.length===7&&!celebrated){celebrated=true;setTimeout(()=>$('final').scrollIntoView({behavior:reduced()?'instant':'smooth',block:'center'}),100);} }
$('close-task').onclick=closeTask;$('task-done').onclick=closeTask;
$('task').addEventListener('cancel',()=>{if(solved.length===7)celebrated=true;});
$('next').onclick=()=>{const q=questions.find(q=>!solved.includes(q.id));if(q)openTask(q.id);else $('final').scrollIntoView({behavior:reduced()?'instant':'smooth'});};
function showInfo(title,paragraphs,buttons=[]){$('info-title').textContent=title;$('info-body').replaceChildren();paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;$('info-body').append(p);});$('info-actions').replaceChildren();buttons.forEach(({text,action})=>{const b=document.createElement('button');b.className='primary';b.textContent=text;b.onclick=action;$('info-actions').append(b);});$('info').showModal();}
$('close-info').onclick=()=>$('info').close();
$('about').onclick=()=>showInfo('Безопасный праздник начинается с тебя',['«КиберЁлка» — новогодняя учебная игра по цифровой безопасности для #ПГАТККЛЕЩЕВА. Выбирай игрушки в любом порядке: верный ответ зажигает огонёк, ошибка даёт подсказку. Это обучение, а не экзамен.','Имя, телефон, пароли и коды игра не запрашивает. На устройстве сохраняются только номера пройденных заданий. Регистрации и общей таблицы результатов нет. Хостинг может обрабатывать технические данные посещения по своим правилам.','Прогресс привязан к этому браузеру. На другом устройстве или после очистки данных он может быть недоступен. Чтобы удалить прогресс, нажми «Начать заново». Новогодняя мелодия запускается автоматически, если браузер разрешает звук. Иначе она включится после первого нажатия на страницу. Музыку можно выключить кнопкой сверху.']);
$('reset').onclick=()=>showInfo('Зажечь ёлку заново?',['Прогресс в этом браузере будет удалён. Все семь игрушек снова станут заданиями.'],[{text:'Да, начать заново',action:()=>{solved=[];celebrated=false;save();render();$('info').close();$('next').focus();$('live').textContent='Прогресс сброшен.';}},{text:'Продолжить игру',action:()=>$('info').close()}]);
function reduced(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
if(!reduced()){for(let i=0;i<32;i++){const f=document.createElement('span');f.className='flake';f.style.left=((i*37)%100)+'%';f.style.animationDuration=(12+i%9)+'s';f.style.animationDelay=-(i%17)+'s';f.style.opacity=(.12+(i%4)*.08);document.querySelector('.snow').append(f);}}
// «Jingle Bells»: инструментальная аранжировка для колокольчиков и мягкого баса.
const festiveNotes=[
[76,1],[76,1],[76,2],[76,1],[76,1],[76,2],[76,1],[79,1],[72,1.5],[74,.5],[76,4],
[77,1],[77,1],[77,1.5],[77,.5],[77,1],[76,1],[76,1],[76,.5],[76,.5],[76,1],[74,1],[74,1],[76,1],[74,2],[79,2],
[76,1],[76,1],[76,2],[76,1],[76,1],[76,2],[76,1],[79,1],[72,1.5],[74,.5],[76,4],
[77,1],[77,1],[77,1.5],[77,.5],[77,1],[76,1],[76,1],[76,.5],[76,.5],[79,1],[79,1],[77,1],[74,1],[72,4]
];
const BEAT=.32,trackSeconds=festiveNotes.reduce((s,n)=>s+n[1],0)*BEAT+1.2;
const voices=new Set();
let wantsMusic=true,audioRequest=0;
function initAudio(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('audio unavailable');audio=audio||new AC();return audio;}
function instrument(freq,start,duration,volume=.055,bass=false){
 const partials=bass?[[1,1],[2,.12]]:[[1,1],[2,.22],[3,.06]];
 for(const [multiple,weight] of partials){
  const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=freq*multiple;
  g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(volume*weight,start+.008);g.gain.exponentialRampToValueAtTime(.0001,start+duration);
  o.connect(g);g.connect(audio.destination);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};o.start(start);o.stop(start+duration+.03);
 }
}
function tone(freq,start,duration){instrument(freq,start,duration,.04);}
function melody(){
 if(!soundOn||audio.state!=='running')return;
 const begin=audio.currentTime+.04;let beat=0;
 for(const [note,length] of festiveNotes){instrument(440*Math.pow(2,(note-69)/12),begin+beat*BEAT,Math.max(.24,length*BEAT*.88));beat+=length;}
 const chords=[[48,52,55],[48,52,55],[48,52,55],[48,52,55],[53,57,60],[48,52,55],[55,59,62],[55,59,62],
 [48,52,55],[48,52,55],[48,52,55],[48,52,55],[53,57,60],[48,52,55],[55,59,62],[48,52,55]];
 for(let bar=0;bar*4<beat;bar++){
  const chord=chords[bar%chords.length],at=begin+bar*4*BEAT;
  instrument(440*Math.pow(2,(chord[0]-69)/12),at,.65,.035,true);
  for(const offset of [1,3])for(const note of chord)instrument(440*Math.pow(2,(note+12-69)/12),at+offset*BEAT,.38,.012);
 }
}
function chime(){if(soundOn&&audio?.state==='running'){tone(783.99,audio.currentTime,.3);tone(1046.5,audio.currentTime+.15,.6);}}
function soundLabel(mode){
 const b=$('sound');b.setAttribute('aria-pressed',String(mode==='on'));
 b.setAttribute('aria-label',mode==='on'?'Выключить музыку':mode==='waiting'?'Включить новогоднюю музыку':'Включить музыку');
 b.lastElementChild.textContent=mode==='on'?'Выключить':mode==='waiting'?'Нажми для музыки':'Музыка';
 b.title=mode==='waiting'?'Музыка включится после первого нажатия на страницу':'Новогодняя мелодия «Jingle Bells»';
}
function stopSound(){
 audioRequest++;soundOn=false;clearInterval(musicTimer);musicTimer=null;
 for(const o of voices){try{o.stop();}catch{}}voices.clear();
 if(audio)audio.suspend().catch(()=>{});soundLabel(wantsMusic?'waiting':'off');
}
function startSound(){
 if(!wantsMusic||document.hidden||soundOn)return;
 const request=++audioRequest;
 try{
  initAudio();
  const ready=()=>{if(request!==audioRequest||!wantsMusic||document.hidden||audio.state!=='running'||soundOn)return;
   soundOn=true;soundLabel('on');melody();musicTimer=setInterval(melody,trackSeconds*1000);
  };
  if(audio.state==='running'){ready();return;}
  soundLabel('waiting');audio.resume().then(ready).catch(()=>{if(request===audioRequest)soundLabel('waiting');});
 }catch{soundLabel('off');}
}
$('sound').onclick=()=>{if(soundOn){wantsMusic=false;stopSound();}else{wantsMusic=true;startSound();}};
function firstInteraction(event){
 if(event.target.closest?.('#sound'))return;
 if(event.type==='keydown'&&!['Enter',' ','ArrowDown','ArrowUp','Tab'].includes(event.key))return;
 if(wantsMusic&&!soundOn)startSound();
}
document.addEventListener('click',firstInteraction);
document.addEventListener('keydown',firstInteraction);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSound();else if(wantsMusic)startSound();});
startSound();
$('download').onclick=()=>{
 const c=document.createElement('canvas');c.width=1080;c.height=1440;const ctx=c.getContext('2d');ctx.fillStyle='#102d2a';ctx.fillRect(0,0,1080,1440);
 const g=ctx.createRadialGradient(540,720,30,540,720,600);g.addColorStop(0,'#366047');g.addColorStop(1,'#102d2a');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1440);ctx.strokeStyle='#ead59a';ctx.lineWidth=2;ctx.strokeRect(45,45,990,1350);
 ctx.textAlign='center';ctx.fillStyle='#ead59a';ctx.font='22px Arial';ctx.fillText('НОВОГОДНЯЯ МИССИЯ ВЫПОЛНЕНА',540,145);ctx.font='78px Georgia';ctx.fillText('Я зажёг КиберЁлку!',540,260);
 ctx.fillStyle='#9b7956';ctx.fillRect(520,920,40,100);[ [360,660,175],[470,820,250],[640,1010,350] ].forEach(([top,bottom,width])=>{ctx.beginPath();ctx.moveTo(540,top);ctx.lineTo(540-width,bottom);ctx.quadraticCurveTo(540,bottom+60,540+width,bottom);ctx.closePath();ctx.fillStyle='#377657';ctx.fill();});
 ctx.fillStyle='#f4db92';ctx.font='92px Georgia';ctx.fillText('★',540,390);[[540,510],[470,620],[620,700],[380,790],[530,840],[720,920],[440,960]].forEach(([x,y])=>{ctx.shadowColor='#f4db92';ctx.shadowBlur=30;ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);ctx.fillStyle='#f4db92';ctx.fill();});ctx.shadowBlur=0;
 ctx.fillStyle='#f4f1df';ctx.font='29px Arial';ctx.fillText('7 огоньков · 7 безопасных решений',540,1120);ctx.font='26px Arial';ctx.fillText('Пусть яркими будут впечатления,',540,1190);ctx.fillText('а надёжными — цифровые привычки!',540,1230);ctx.fillStyle='#ead59a';ctx.font='bold 25px Arial';ctx.fillText('#ПГАТККЛЕЩЕВА',540,1330);
 c.toBlob(blob=>{if(!blob){$('share-note').textContent='Не удалось создать открытку.';return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='CyberElka_open_card.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('share-note').textContent='Открытка готова. Если скачивание недоступно во встроенном браузере, открой игру во внешнем браузере.';},'image/png');
};
$('share').onclick=async()=>{if(!/^https?:$/.test(location.protocol)){$('share-note').textContent='Поделиться ссылкой можно после публикации игры в интернете.';return;}const url=location.href.split('#')[0].split('?')[0],text='🎄 Я зажёг КиберЁлку! Спаси цифровой праздник и ты. #ПГАТККЛЕЩЕВА';try{if(navigator.share){await navigator.share({title:'КиберЁлка',text,url});}else{window.open('https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text),'_blank','noopener,noreferrer');}}catch(e){if(e.name!=='AbortError')$('share-note').textContent='Скопируй ссылку на игру из адресной строки и отправь друзьям.';}};
render();


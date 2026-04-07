// Navegación sencilla
document.querySelectorAll('#main-nav a').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();const id=a.getAttribute('href').slice(1);const el=document.getElementById(id);if(el) el.scrollIntoView({behavior:'smooth'});});});

// Motor de lecciones y quizzes (consume window.LESSONS definido en data/lessons.js)
function renderLessonsList(){
  if(!window.LESSONS) return;
  const container = document.createElement('section');
  container.id = 'lessons-list';
  container.innerHTML = '<h2>Lecciones</h2>';
  const list = document.createElement('div');
  list.style.display = 'grid';
  list.style.gridTemplateColumns = '1fr 1fr';
  list.style.gap = '12px';
  window.LESSONS.sections.forEach(sec=>{
    const card = document.createElement('div');
    card.style.padding = '12px';
    card.style.background = 'rgba(255,255,255,0.02)';
    card.style.borderRadius = '8px';
    card.innerHTML = `<h3>${sec.title}</h3><div>${sec.content}</div>`;
    const btn = document.createElement('button');
    btn.textContent = 'Ver lección y quiz';
    btn.style.marginTop = '8px';
    btn.addEventListener('click', ()=> renderLessonView(sec));
    card.appendChild(btn);
    list.appendChild(card);
  });
  container.appendChild(list);
  const main = document.querySelector('main');
  main.insertBefore(container, main.firstChild.nextSibling);
}

function renderLessonView(sec){
  // si la sección tiene topics, mostrar lista de topics
  let view = document.getElementById('lesson-view');
  if(!view){
    view = document.createElement('section');
    view.id = 'lesson-view';
    document.querySelector('main').appendChild(view);
  }
  view.innerHTML = '';
  const title = document.createElement('h2'); title.textContent = sec.title; view.appendChild(title);
  if(sec.content){ const content = document.createElement('div'); content.innerHTML = sec.content; view.appendChild(content); }

  if(sec.topics && sec.topics.length){
    const intro = document.createElement('p'); intro.textContent = 'Selecciona un tema para ver su contenido y responder las preguntas (primero explicación, luego 5 preguntas).'; view.appendChild(intro);
    sec.topics.forEach((t, idx)=>{
      const tcard = document.createElement('div');
      tcard.style.padding='10px'; tcard.style.marginTop='8px'; tcard.style.background='rgba(255,255,255,0.01)'; tcard.style.borderRadius='8px';
      tcard.innerHTML = `<h3>${t.title}</h3><div>${t.content.split('</p>')[0] || ''}</div>`;
      const open = document.createElement('button'); open.textContent = 'Abrir tema'; open.style.marginTop='8px';
      open.addEventListener('click', ()=> renderTopic(sec.id, t.id));
      tcard.appendChild(open);
      view.appendChild(tcard);
    });
  } else if(sec.quizzes){
    // compatibilidad con secciones antiguas
    const qh = document.createElement('h3'); qh.textContent = 'Cuestionarios'; view.appendChild(qh);
    sec.quizzes.forEach(q=>{ renderQuestionBox(q, view); });
  }
  view.scrollIntoView({behavior:'smooth'});
}

function renderTopic(sectionId, topicId){
  const sec = window.LESSONS.sections.find(s=>s.id===sectionId);
  if(!sec) return;
  const topic = sec.topics.find(t=>t.id===topicId);
  if(!topic) return;
  let view = document.getElementById('topic-view');
  if(!view){ view = document.createElement('section'); view.id='topic-view'; document.querySelector('main').appendChild(view); }
  view.innerHTML = '';
  const title = document.createElement('h2'); title.textContent = topic.title; view.appendChild(title);
  const content = document.createElement('div'); content.innerHTML = topic.content; view.appendChild(content);

  const startBtn = document.createElement('button'); startBtn.textContent = `Empezar preguntas (${topic.quizzes.length})`; startBtn.style.marginTop='12px';
  startBtn.addEventListener('click', ()=> startTopicQuiz(sectionId, topicId));
  view.appendChild(startBtn);

  // Si es el topic de CPU, insertar diagrama interactivo
  if(topicId === 'cpu'){
    const diagWrap = document.createElement('div'); diagWrap.id = 'cpu-diagram-wrap'; diagWrap.style.display='flex'; diagWrap.style.gap='12px'; diagWrap.style.marginTop='12px';
    const svgContainer = document.createElement('div'); svgContainer.id = 'cpu-diagram-container'; svgContainer.style.flex='1'; svgContainer.style.minWidth='420px';
    const infoBox = document.createElement('div'); infoBox.id = 'cpu-diagram-info'; infoBox.style.width='320px'; infoBox.style.padding='12px'; infoBox.style.background='rgba(255,255,255,0.02)'; infoBox.style.borderRadius='8px'; infoBox.innerHTML = '<strong>Diagrama de la CPU</strong><p>Pasa el cursor sobre una parte para ver su descripción.</p>';
    diagWrap.appendChild(svgContainer); diagWrap.appendChild(infoBox); view.appendChild(diagWrap);
      loadAndAttachCpuDiagram(svgContainer, infoBox); // placeholder
    }
  
    function loadAndAttachCpuDiagram(container, infoBox){
      // carga SVG y añade interactividad (hover y click)
      fetch('assets/cpu-diagram.svg')
        .then(r=>r.text())
        .then(svgText=>{
          container.innerHTML = svgText;
          const svg = container.querySelector('svg');
          if(!svg) return;
          const parts = {
            'alu': 'ALU: realiza operaciones aritméticas y lógicas básicas.',
            'fpu': 'FPU: unidad dedicada a operaciones en punto flotante (cálculos científicos).',
            'registers': 'Registros: almacenamiento rápido dentro del núcleo para datos temporales.',
            'pipeline': 'Pipeline: etapas que permiten paralelizar la ejecución de instrucciones (fetch→decode→execute→mem→writeback).',
            'l1': 'Caché L1: caché más cercana al núcleo, latencia mínima, pequeña capacidad.',
            'l2': 'Caché L2: caché intermedia con mayor capacidad que L1.',
            'l3': 'Caché L3: caché de último nivel compartida entre núcleos (si aplica).',
            'tlb': 'TLB: caché de traducciones de páginas que acelera la MMU.'
          };
          let last = null;
          Object.keys(parts).forEach(id=>{
            const el = svg.querySelector('#'+id);
            if(!el) return;
            el.style.transition = 'stroke 120ms, stroke-width 120ms, filter 120ms';
            el.addEventListener('mouseenter', ()=>{
              if(last && last!==el){
                try{ last.style.stroke = last.getAttribute('data-original-stroke') || '#38bdf8'; last.style.strokeWidth = last.getAttribute('data-original-stroke-width') || '1.5'; }catch(e){}
              }
              if(!el.getAttribute('data-original-stroke')){
                el.setAttribute('data-original-stroke', el.style.stroke || el.getAttribute('stroke') || '#38bdf8');
                el.setAttribute('data-original-stroke-width', el.style.strokeWidth || el.getAttribute('stroke-width') || '1.5');
              }
              el.style.stroke = '#ffffff'; el.style.strokeWidth = '2.6'; el.style.filter = 'drop-shadow(0 0 6px rgba(56,189,248,0.6))';
              infoBox.innerHTML = `<strong>${id.toUpperCase()}</strong><p>${parts[id]}</p>`;
              last = el;
            });
            el.addEventListener('mouseleave', ()=>{
              // restaurar
              const orig = el.getAttribute('data-original-stroke') || '#38bdf8';
              const origW = el.getAttribute('data-original-stroke-width') || '1.5';
              el.style.stroke = orig; el.style.strokeWidth = origW; el.style.filter = '';
              infoBox.innerHTML = '<strong>Diagrama de la CPU</strong><p>Pasa el cursor sobre una parte para ver su descripción.</p>';
            });
            el.addEventListener('click', ()=>{
              // al hacer click, fijar descripción
              infoBox.innerHTML = `<strong>${id.toUpperCase()}</strong><p>${parts[id]}</p><p style="margin-top:8px;color:#9bdaf2;">(clic para fijar/desfijar)</p>`;
            });
          });
          // interactividad para grupo core
          const core = svg.querySelector('#core');
          if(core){
            core.addEventListener('mouseenter', ()=>{ infoBox.innerHTML = '<strong>CPU Core</strong><p>Conjunto de unidades (ALU, FPU, registros, pipeline) que ejecutan instrucciones.</p>'; core.style.stroke='#fff'; core.style.strokeWidth='1.8'; });
            core.addEventListener('mouseleave', ()=>{ core.style.stroke = core.getAttribute('data-original-stroke') || '#38bdf8'; core.style.strokeWidth = core.getAttribute('data-original-stroke-width') || '1.5'; infoBox.innerHTML = '<strong>Diagrama de la CPU</strong><p>Pasa el cursor sobre una parte para ver su descripción.</p>'; });
          }
        })
        .catch(err=>{ container.innerHTML = '<p>Error cargando diagrama.</p>'; console.error(err); });
    }
  }

  // navegación entre topics
  const nav = document.createElement('div'); nav.style.marginTop='12px';
  const back = document.createElement('button'); back.textContent='Volver a lecciones'; back.style.marginRight='8px'; back.addEventListener('click', ()=>{ document.getElementById('lesson-view').scrollIntoView({behavior:'smooth'}); });
  nav.appendChild(back);
  view.appendChild(nav);
  view.scrollIntoView({behavior:'smooth'});
}

function startTopicQuiz(sectionId, topicId){
  const sec = window.LESSONS.sections.find(s=>s.id===sectionId);
  const topic = sec.topics.find(t=>t.id===topicId);
  if(!topic) return;
  // preparar vista de preguntas
  let qview = document.getElementById('quiz-run');
  if(!qview){ qview = document.createElement('section'); qview.id='quiz-run'; document.querySelector('main').appendChild(qview); }
  qview.innerHTML = '';
  const title = document.createElement('h2'); title.textContent = `Preguntas: ${topic.title}`; qview.appendChild(title);

  // traer progreso guardado
  const progressKey = `progress_${sectionId}_${topicId}`;
  const saved = JSON.parse(localStorage.getItem(progressKey) || 'null');

  topic.quizzes.forEach((q, i)=>{
    const qbox = document.createElement('div'); qbox.style.padding='12px'; qbox.style.marginTop='8px'; qbox.style.background='rgba(255,255,255,0.01)'; qbox.style.borderRadius='8px';
    const qtitle = document.createElement('p'); qtitle.textContent = `${i+1}. ${q.question}`; qbox.appendChild(qtitle);
    const choicesDiv = document.createElement('div'); choicesDiv.className='choices'; qbox.appendChild(choicesDiv);
    Object.entries(q.choices).forEach(([k, text])=>{
      const btn = document.createElement('button'); btn.textContent = `${k}: ${text}`; btn.dataset.choice=k; btn.style.marginRight='8px';
      btn.addEventListener('click', ()=>{
        const already = saved && saved.answers && saved.answers[q.id];
        if(already){
          // ya respondida: mostrar explicación
          handleAnswer(q, k, qbox);
        } else {
          handleAnswer(q, k, qbox);
          // guardar respuesta
          const newSaved = saved || {answers:{}};
          newSaved.answers[q.id] = {choice:k, correct: k===q.correct, time: Date.now()};
          localStorage.setItem(progressKey, JSON.stringify(newSaved));
        }
      });
      choicesDiv.appendChild(btn);
    });
    const fb = document.createElement('p'); fb.className='quiz-feedback'; qbox.appendChild(fb);
    // mostrar feedback si ya hay respuesta guardada
    if(saved && saved.answers && saved.answers[q.id]){
      const prev = saved.answers[q.id]; handleAnswer(q, prev.choice, qbox);
    }
    qview.appendChild(qbox);
  });

  // resumen y boton siguiente tema
  const summary = document.createElement('div'); summary.style.marginTop='12px';
  const scoreBtn = document.createElement('button'); scoreBtn.textContent='Ver resumen'; scoreBtn.addEventListener('click', ()=> showTopicSummary(sectionId, topicId));
  summary.appendChild(scoreBtn);
  qview.appendChild(summary);
  qview.scrollIntoView({behavior:'smooth'});
}

function renderQuestionBox(q, view){
  const qbox = document.createElement('div'); qbox.style.padding='12px'; qbox.style.marginTop='8px'; qbox.style.background='rgba(255,255,255,0.01)'; qbox.style.borderRadius='8px';
  const qtitle = document.createElement('p'); qtitle.textContent = q.question; qbox.appendChild(qtitle);
  const choicesDiv = document.createElement('div'); choicesDiv.className = 'choices'; qbox.appendChild(choicesDiv);
  Object.entries(q.choices).forEach(([k,text])=>{
    const btn = document.createElement('button'); btn.textContent = `${k}: ${text}`; btn.dataset.choice=k; btn.style.marginRight='8px'; btn.addEventListener('click', ()=> handleAnswer(q,k,qbox));
    choicesDiv.appendChild(btn);
  });
  const fb = document.createElement('p'); fb.className = 'quiz-feedback'; qbox.appendChild(fb);
  view.appendChild(qbox);
}

function showTopicSummary(sectionId, topicId){
  const progressKey = `progress_${sectionId}_${topicId}`;
  const saved = JSON.parse(localStorage.getItem(progressKey) || 'null');
  const sec = window.LESSONS.sections.find(s=>s.id===sectionId);
  const topic = sec.topics.find(t=>t.id===topicId);
  let correct=0; let total = topic.quizzes.length;
  if(saved && saved.answers){
    total = topic.quizzes.length;
    topic.quizzes.forEach(q=>{ if(saved.answers[q.id] && saved.answers[q.id].correct) correct++; });
  }
  alert(`Resumen: ${correct}/${total} respuestas correctas.`);
}

function handleAnswer(question, choice, container){
  const fb = container.querySelector('.quiz-feedback');
  if(!fb) return;
  if(choice === question.correct){
    fb.textContent = 'Correcto ✅ — ' + (question.explanation && question.explanation.correct ? question.explanation.correct : 'Bien respondido.');
    fb.style.color = 'lightgreen';
  } else {
    let reason = '';
    if(question.explanation && question.explanation.incorrect){
      reason = question.explanation.incorrect[choice] || question.explanation.incorrect['default'] || '';
    }
    fb.textContent = 'Incorrecto ❌ — ' + (reason || 'Revisa la lección relacionada para más detalles.');
    fb.style.color = '#ffb3b3';
  }
}

// Atajos: Ctrl+K para enfocar navegación
window.addEventListener('keydown', (e)=>{
  if(e.ctrlKey && e.key.toLowerCase()==='k'){
    const nav = document.getElementById('main-nav'); if(nav){ const first = nav.querySelector('a'); if(first) first.focus(); }
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  renderLessonsList();
});

// Registrar service worker para modo offline / "Agregar a pantalla de inicio"
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./service-worker.js')
      .then(()=> console.log('Service Worker registrado'))
      .catch(err=> console.log('Error registrando Service Worker', err));
  });
}

// -- Perfil: export/import/reset progreso --
document.addEventListener('DOMContentLoaded', ()=>{
  const exportBtn = document.getElementById('export-progress');
  const importBtn = document.getElementById('import-progress');
  const resetBtn = document.getElementById('reset-progress');
  const viewBtn = document.getElementById('view-progress');
  const importFile = document.getElementById('import-file');

  if(exportBtn){
    exportBtn.addEventListener('click', ()=>{
      const keys = Object.keys(localStorage).filter(k=>k.startsWith('progress_'));
      const out = {};
      keys.forEach(k=> out[k] = JSON.parse(localStorage.getItem(k)));
      const blob = new Blob([JSON.stringify(out,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'os-edu-progress.json'; a.click();
      URL.revokeObjectURL(url);
    });
  }
  if(importBtn){
    importBtn.addEventListener('click', ()=> importFile.click());
  }
  if(importFile){
    importFile.addEventListener('change', (e)=>{
      const f = e.target.files[0]; if(!f) return;
      const reader = new FileReader();
      reader.onload = ev=>{
        try{
          const data = JSON.parse(ev.target.result);
          Object.keys(data).forEach(k=> localStorage.setItem(k, JSON.stringify(data[k])));
          alert('Progreso importado correctamente.');
        }catch(err){ alert('Archivo inválido.'); }
      };
      reader.readAsText(f);
    });
  }
  if(resetBtn){
    resetBtn.addEventListener('click', ()=>{
      if(confirm('¿Seguro que quieres reiniciar todo el progreso?')){
        Object.keys(localStorage).filter(k=>k.startsWith('progress_')).forEach(k=> localStorage.removeItem(k));
        alert('Progreso reiniciado.');
      }
    });
  }
  if(viewBtn){
    viewBtn.addEventListener('click', ()=>{
      const keys = Object.keys(localStorage).filter(k=>k.startsWith('progress_'));
      if(keys.length===0){ alert('No hay progreso guardado.'); return; }
      let msg = '';
      keys.forEach(k=>{ const p = JSON.parse(localStorage.getItem(k)); const answered = Object.keys(p.answers||{}).length; msg += `${k}: ${answered} preguntas respondidas\n`; });
      alert(msg);
    });
  }
});

// -- Carrera y Empleo: botón búsqueda de trabajo --
document.addEventListener('DOMContentLoaded', ()=>{
  const jobBtn = document.getElementById('search-jobs-btn');
  if(jobBtn){
    jobBtn.addEventListener('click', ()=>{
      window.open('https://www.linkedin.com/jobs/search/?keywords=t%C3%A9cnico+en+inform%C3%A1tica&location=Santiago%2C+Chile', '_blank', 'noopener,noreferrer');
    });
  }
});

function enableSvgPanZoom(containerSelector){
  const wrap = document.querySelector(containerSelector);
  if(!wrap) return;
  let svg = wrap.querySelector('svg');
  if(!svg) return;
  svg.style.transformOrigin = '0 0';
  let scale = 1; let originX = 0; let originY = 0; let isPanning=false; let startX, startY;
  function setTransform(){ svg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`; }
  // wheel zoom
  wrap.addEventListener('wheel', (e)=>{
    e.preventDefault(); const delta = -e.deltaY*0.001; const newScale = Math.min(4, Math.max(0.5, scale + delta));
    // zoom toward pointer
    const rect = svg.getBoundingClientRect(); const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
    const factor = newScale/scale;
    originX = (originX - mx) * factor + mx; originY = (originY - my) * factor + my; scale = newScale; setTransform();
  }, {passive:false});
  // pan with pointer
  wrap.addEventListener('pointerdown', (e)=>{ isPanning=true; startX = e.clientX - originX; startY = e.clientY - originY; wrap.setPointerCapture(e.pointerId); });
  window.addEventListener('pointermove', (e)=>{ if(!isPanning) return; originX = e.clientX - startX; originY = e.clientY - startY; setTransform(); });
  window.addEventListener('pointerup', (e)=>{ isPanning=false; });
  // touch pinch (basic)
  let lastDist = null; wrap.addEventListener('touchmove', (e)=>{
    if(e.touches && e.touches.length===2){ e.preventDefault(); const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; const dist = Math.hypot(dx,dy); if(lastDist){ const ds = (dist-lastDist)*0.005; scale = Math.min(4, Math.max(0.5, scale + ds)); setTransform(); } lastDist = dist; }
  }, {passive:false});
  wrap.addEventListener('touchend', ()=> lastDist = null);
}

// Autoactivar pan/zoom cuando se carga el diagrama
const observer = new MutationObserver((m)=>{
  if(document.getElementById('cpu-diagram-container') && document.getElementById('cpu-diagram-container').querySelector('svg')){
    enableSvgPanZoom('#cpu-diagram-container');
    observer.disconnect();
  }
});
observer.observe(document.body, {childList:true, subtree:true});

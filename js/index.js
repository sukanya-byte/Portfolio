
// ── motion preference ─────────────────────────────────────────
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.body.classList.add('no-motion');
}
var NO_MOTION = document.body.classList.contains('no-motion');

// ── Creatives filter (with staggered pop) ─────────────────────
document.querySelectorAll('.filter').forEach(function(f){
  f.addEventListener('click',function(){
    document.querySelectorAll('.filter').forEach(function(x){x.classList.remove('active');});
    f.classList.add('active');
    var cat=f.dataset.f, visIdx=0;
    document.querySelectorAll('.cre-item').forEach(function(item){
      var show = cat==='all' || item.dataset.cat===cat;
      item.classList.toggle('hidden',!show);
      item.classList.remove('pop');
      if(show && !NO_MOTION){
        void item.offsetWidth; // restart animation
        item.style.animationDelay=(visIdx*0.07)+'s';
        item.classList.add('pop');
        visIdx++;
      }
    });
  });
});

// ── Work experience toggle ────────────────────────────────────
document.querySelectorAll('.exp-card').forEach(function(card){
  var toggle=card.querySelector('.exp-toggle');
  if(!toggle)return;
  toggle.addEventListener('click',function(){
    var isOpen=card.classList.toggle('open');
    toggle.classList.toggle('open',isOpen);
    toggle.textContent=isOpen?'✕':'+';
  });
});

// ── Scroll reveal ─────────────────────────────────────────────
(function(){
  var els=document.querySelectorAll('.r');
  if(NO_MOTION || !('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in');});return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    });
  },{threshold:0.08,rootMargin:'0px 0px -5% 0px'});
  els.forEach(function(e){io.observe(e);});
  setTimeout(function(){els.forEach(function(e){e.classList.add('in');});},2600);
})();

// ── Thread rail: stops ────────────────────────────────────────
var THREAD_STOPS=['top','case-studies','process','experience','videos','creatives','contact'];
function buildThreadStops(){
  var rail=document.getElementById('thread');if(!rail)return;
  rail.querySelectorAll('.stop').forEach(function(s){s.remove();});
  var docH=document.documentElement.scrollHeight;
  THREAD_STOPS.forEach(function(id){
    var el=document.getElementById(id);if(!el)return;
    var sp=document.createElement('span');
    sp.className='stop';
    sp.style.top=((el.offsetTop+90)/docH*100)+'%';
    rail.appendChild(sp);
  });
}

// ── Scroll engine: thread fill + nav + stacked case depth ─────
var _lastY=0;
var _caseCards=[],_hiwSection=null;
document.addEventListener('DOMContentLoaded',function(){
  _caseCards=Array.prototype.slice.call(document.querySelectorAll('.case-stack .case'));
  _hiwSection=document.querySelector('.hiw');
  setStickyTops();
});
// Compute each card's sticky offset so cards taller than the viewport still reveal
// all of their content while pinned (prevents bottom-clipping on mobile/tablet).
function setStickyTops(){
  if(!_caseCards.length)return;
  var vh=window.innerHeight;
  _caseCards.forEach(function(card,i){
    var base=86+i*16;
    var ch=card.offsetHeight;
    var top=(ch+16>vh-base)?Math.round(vh-ch-16):base;
    card.style.top=top+'px';
  });
}
function onScroll(){
  var y=window.scrollY;
  var h=document.documentElement.scrollHeight-window.innerHeight;
  var pct=h>0?y/h:0;
  var fill=document.getElementById('thread-fill');
  var ndl=document.getElementById('thread-needle');
  if(fill)fill.style.height=(pct*100)+'%';
  if(ndl)ndl.style.top=(pct*100)+'%';
  document.querySelectorAll('#thread .stop').forEach(function(sp){
    sp.classList.toggle('lit',pct>=parseFloat(sp.style.top)/100-0.005);
  });
  // nav: blur when scrolled, hide on scroll-down
  var nav=document.querySelector('.nav-wrap');
  if(nav){
    nav.classList.toggle('scrolled',y>40);
    if(y>360 && y>_lastY+4){nav.classList.add('hide');}else{nav.classList.remove('hide');}
  }
  _lastY=y;
  // active nav link
  var cur='';
  ['case-studies','videos','creatives'].forEach(function(id){
    var el=document.getElementById(id);
    if(el && el.offsetTop-220<=y)cur=id;
  });
  document.querySelectorAll('.nav-link[data-sec]').forEach(function(a){
    a.classList.toggle('active',a.dataset.sec===cur);
  });
  // stacked case-card depth (smoothstep-eased, rAF-driven) — runs on all screen sizes
  if(!NO_MOTION){
    _caseCards.forEach(function(card,i){
      var next=_caseCards[i+1]||_hiwSection;if(!next)return;
      var nr=next.getBoundingClientRect();
      var t=Math.min(Math.max((window.innerHeight*0.85-nr.top)/(window.innerHeight*0.6),0),1);
      t=t*t*(3-2*t); // smoothstep — eases in/out instead of linear
      card.style.transform='translateZ(0) scale('+(1-t*0.05).toFixed(4)+')';
      card.style.filter='brightness('+(1-t*0.3).toFixed(3)+')';
    });
  }else{
    _caseCards.forEach(function(c){c.style.transform='';c.style.filter='';});
  }
}
// rAF throttle: at most one update per frame, values eased with smoothstep
var _ticking=false;
function requestScrollUpdate(){
  if(_ticking)return;
  _ticking=true;
  requestAnimationFrame(function(){onScroll();_ticking=false;});
}
window.addEventListener('scroll',requestScrollUpdate,{passive:true});
window.addEventListener('resize',function(){buildThreadStops();setStickyTops();requestScrollUpdate();},{passive:true});

// ── 3D tilt on case visuals ───────────────────────────────────
function initTilt(){
  if(NO_MOTION)return;
  document.querySelectorAll('.case-visual').forEach(function(zone){
    var box=zone.firstElementChild;if(!box)return;
    zone.addEventListener('mousemove',function(e){
      var r=zone.getBoundingClientRect();
      var rx=((e.clientY-r.top)/r.height-.5)*-7;
      var ry=((e.clientX-r.left)/r.width-.5)*9;
      box.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';
    });
    zone.addEventListener('mouseleave',function(){box.style.transform='rotateX(0) rotateY(0)';});
  });
}

// ── init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',function(){
  buildThreadStops();
  initTilt();
  onScroll();
  requestAnimationFrame(function(){document.body.classList.add('loaded');});
});
window.addEventListener('load',function(){buildThreadStops();setStickyTops();});

// ── Video cards: muted hover-preview + click-to-play with sound (one at a time) ──
(function(){
  var cards=[].slice.call(document.querySelectorAll('.video-card'));
  var soundCard=null;
  function stopSound(){
    if(!soundCard)return;
    var sv=soundCard.querySelector('.vc-video');
    if(sv){sv.pause();sv.muted=true;}
    soundCard.classList.remove('playing');
    soundCard=null;
  }
  cards.forEach(function(card){
    var v=card.querySelector('.vc-video');
    var btn=card.querySelector('.vc-play');
    if(!v)return;
    // muted hover preview — disabled while any card is playing with sound
    card.addEventListener('mouseenter',function(){
      if(soundCard)return;
      v.muted=true;
      var p=v.play(); if(p&&p.catch)p.catch(function(){});
    });
    card.addEventListener('mouseleave',function(){
      if(soundCard===card)return;
      v.pause(); try{v.currentTime=0;}catch(e){} v.load();
    });
    function toggle(){
      if(soundCard===card){ stopSound(); return; }
      stopSound();
      soundCard=card;
      card.classList.add('playing');
      v.muted=false;
      var p=v.play(); if(p&&p.catch)p.catch(function(){});
    }
    if(btn){btn.addEventListener('click',function(e){e.stopPropagation();toggle();});
      btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});}
    v.addEventListener('click',function(){toggle();});
  });
})();


/* ---- */


(function(){
  var lb=document.getElementById('vlightbox'); if(!lb)return;
  var lv=lb.querySelector('.vlb-video'), closeBtn=lb.querySelector('.vlb-close');
  function open(src){
    lv.src=src;
    lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
    document.body.classList.add('vlb-lock'); closeBtn.focus();
  }
  function close(){
    lv.pause(); lv.removeAttribute('src'); lv.load();
    lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
    document.body.classList.remove('vlb-lock');
  }
  document.querySelectorAll('.video-card').forEach(function(card){
    var ex=card.querySelector('.vc-expand'), srcEl=card.querySelector('.vc-video source');
    if(!ex||!srcEl)return;
    function go(e){ if(e)e.stopPropagation(); var cv=card.querySelector('.vc-video'); if(cv)cv.pause(); open(srcEl.getAttribute('src')); }
    ex.addEventListener('click',go);
    ex.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();go();} });
  });
  closeBtn.addEventListener('click',close);
  lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&lb.classList.contains('open')) close(); });
})();

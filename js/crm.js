
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.body.classList.add('no-motion');
}
var NO_MOTION = document.body.classList.contains('no-motion');

// ── Scroll reveal ──
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

// ── Thread rail ──
var THREAD_STOPS=['top','overview','challenge','frictions','experience','response','delta','more'];
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

// ── Scroll engine: thread + nav + stage stack depth (same as portfolio) ──
var _lastY=0,_stageCards=[],_decisions=null;
document.addEventListener('DOMContentLoaded',function(){
  _stageCards=Array.prototype.slice.call(document.querySelectorAll('.stage-stack .stage'));
  _decisions=document.querySelector('.decisions');
  setStickyTops();
});
// Compute each card's sticky offset so cards taller than the viewport still reveal
// all of their content while pinned (prevents bottom-clipping on mobile/tablet).
function setStickyTops(){
  if(!_stageCards.length)return;
  var vh=window.innerHeight;
  _stageCards.forEach(function(card,i){
    var base=86+i*14;
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
  var nav=document.querySelector('.nav-wrap');
  if(nav){
    nav.classList.toggle('scrolled',y>40);
    if(y>360 && y>_lastY+4){nav.classList.add('hide');}else{nav.classList.remove('hide');}
  }
  _lastY=y;
  // stacked stage depth (smoothstep-eased) — runs on all screen sizes
  if(!NO_MOTION){
    _stageCards.forEach(function(card,i){
      var next=_stageCards[i+1]||_decisions;if(!next)return;
      var nr=next.getBoundingClientRect();
      var t=Math.min(Math.max((window.innerHeight*0.85-nr.top)/(window.innerHeight*0.6),0),1);
      t=t*t*(3-2*t);
      card.style.transform='translateZ(0) scale('+(1-t*0.05).toFixed(4)+')';
      card.style.filter='brightness('+(1-t*0.3).toFixed(3)+')';
    });
  }else{
    _stageCards.forEach(function(c){c.style.transform='';c.style.filter='';});
  }
}
var _ticking=false;
function requestScrollUpdate(){
  if(_ticking)return;
  _ticking=true;
  requestAnimationFrame(function(){onScroll();_ticking=false;});
}
window.addEventListener('scroll',requestScrollUpdate,{passive:true});
window.addEventListener('resize',function(){buildThreadStops();setStickyTops();requestScrollUpdate();},{passive:true});

// ── 3D tilt on stage visuals (same as portfolio cases) ──
function initTilt(){
  if(NO_MOTION)return;
  document.querySelectorAll('.stage-visual').forEach(function(zone){
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

document.addEventListener('DOMContentLoaded',function(){
  buildThreadStops();
  initTilt();
  onScroll();
  requestAnimationFrame(function(){document.body.classList.add('loaded');});
});
window.addEventListener('load',function(){buildThreadStops();setStickyTops();});

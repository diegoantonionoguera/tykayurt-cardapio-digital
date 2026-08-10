(function(){
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.reveal,.reveal-group,.stagger-grid');
  if(reduceMotion){ revealTargets.forEach(el=>el.classList.add('is-visible')); }
  else{
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    },{threshold:.13,rootMargin:'0px 0px -8% 0px'});
    revealTargets.forEach(el=>observer.observe(el));
  }
  const header=document.querySelector('[data-header]');
  let scrollFrame=0;
  const onScroll=()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{
      header?.classList.toggle('is-scrolled',scrollY>18);
      scrollFrame=0;
    });
  };
  onScroll(); addEventListener('scroll',onScroll,{passive:true});
  const sections=[...document.querySelectorAll('[data-section]')];
  const links=[...document.querySelectorAll('[data-nav-link]')];
  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{ if(!entry.isIntersecting)return; links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')===`#${entry.target.id}`)); });
  },{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(s=>sectionObserver.observe(s));
  if(!reduceMotion && matchMedia('(pointer:fine)').matches){
    const root=document.querySelector('[data-parallax-root]'); const items=root?[...root.querySelectorAll('[data-parallax]')]:[];
    if(root&&items.length){
      root.addEventListener('pointermove',e=>{const r=root.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;items.forEach(el=>{const amount=Number(el.dataset.parallax||6);el.style.translate=`${x*amount}px ${y*amount}px`;});});
      root.addEventListener('pointerleave',()=>items.forEach(el=>el.style.translate='0 0'));
    }
  }
})();

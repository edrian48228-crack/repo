(function(){
  document.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('selectstart',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey&&(e.key==='u'||e.key==='U')){e.preventDefault();return false}
    if(e.ctrlKey&&(e.key==='s'||e.key==='S')){e.preventDefault();return false}
    if(e.key==='F12'){e.preventDefault();return false}
    if(e.ctrlKey&&e.shiftKey&&['I','i','J','j','C','c'].includes(e.key)){e.preventDefault();return false}
  });
  const thr=160;let dv=false;
  setInterval(()=>{
    if(window.outerWidth-window.innerWidth>thr||window.outerHeight-window.innerHeight>thr){
      if(!dv){dv=true;document.body.style.opacity='0';setTimeout(()=>{document.body.style.opacity='1';dv=false;},2500);}
    }
  },1200);
  console.log('%c MiTienda Pro © Edrian Cruz Down ','background:#ff6600;color:#fff;font-size:13px;font-weight:bold;padding:5px 12px;border-radius:4px');
  console.log('%c Acceso no autorizado prohibido ','color:#ff2200;font-size:11px');
})();

(function(){
  const params = new URLSearchParams(location.search);
  const source = params.get('utm_source') || (document.referrer.includes('instagram') ? 'instagram' : 'direct');
  window.TYKA_TRACK = function(event, payload={}){
    const record = {event, source, timestamp:new Date().toISOString(), ...payload};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(record);
    try{ console.info('[TykaYurt analytics]', record); }catch(_){ }
  };
  window.TYKA_TRACK('menu_view', {path:location.pathname});
})();

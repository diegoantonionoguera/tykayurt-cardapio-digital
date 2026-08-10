(function(){
  const STORAGE_KEY='tykayurt-cart-v2';
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return []}};
  const save=cart=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart))}catch{}};
  window.TYKA_CART={cart:load(),save};
})();

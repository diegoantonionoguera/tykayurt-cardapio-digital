(function(){
  window.TYKA_COMBOS={
    renderCups(qty){return Array.from({length:qty},()=>'<span class="combo-cup" aria-hidden="true"></span>').join('')},
    progress(selected,total){return total ? Math.round((selected/total)*100) : 0}
  };
})();

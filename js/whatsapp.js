(function(){
  function money(value){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value||0)}
  function knownTotal(cart){return cart.reduce((sum,item)=>sum+(item.price==null?0:item.price*item.qty),0)}
  function hasUnknown(cart){return cart.some(item=>item.price==null)}
  function build(cart,order={}){
    const lines=['Olá, TykaYurt! 🍓','Vim pelo cardápio digital e gostaria de fazer este pedido:',''];
    cart.forEach(i=>lines.push(`• ${i.qty}x ${i.name}${i.meta?` — ${i.meta}`:''}${i.price==null?' — preço a confirmar':` — ${money(i.price*i.qty)}`}`));
    lines.push(''); lines.push(`Total conhecido: ${money(knownTotal(cart))}`);
    if(hasUnknown(cart)) lines.push('Há itens com valor individual a confirmar.');
    if(order.fulfillment||order.payment){
      lines.push('');
      if(order.fulfillment)lines.push(`Recebimento: ${order.fulfillment}`);
      if(order.payment)lines.push(`Pagamento: ${order.payment}`);
    }
    lines.push(''); lines.push('Pode confirmar disponibilidade e valor final?');
    return lines.join('\n');
  }
  window.TYKA_WHATSAPP={
    open({cart=[],useCart=false,number='',order={}}){
      const message=useCart&&cart.length?build(cart,order):'Olá, TykaYurt! 🍓 Vim pelo cardápio digital e gostaria de fazer um pedido.';
      const digits=(number||'').replace(/\D/g,'');
      const url=digits?`https://wa.me/${digits}?text=${encodeURIComponent(message)}`:`https://wa.me/?text=${encodeURIComponent(message)}`;
      window.TYKA_TRACK?.('whatsapp_click',{items:cart.length,useCart}); window.open(url,'_blank','noopener');
    },build
  };
})();

# TykaYurt — Cardápio Digital V2

Cardápio digital responsivo para uso no link da bio do Instagram da TykaYurt.

## Objetivo

Fluxo principal:

`Instagram → Cardápio → Escolha → Combo/Acompanhamento → Pedido → WhatsApp`

## Recursos implementados

- Mobile-first e responsivo para celular, tablet e desktop
- Hero com produtos reais e animações de entrada
- Parallax sutil em desktop
- Morango destacado como carro-chefe / mais pedido
- Sabores: Morango, Abacaxi, Amora e Ameixa
- Tamanhos: 250 ml e 500 ml
- Combo 500 ml: 2 potes por R$ 49,90
- Combo 250 ml: 5 potes por R$ 49,90
- Granola 100 g por R$ 5,00
- Cereal 100 g por R$ 5,00
- Montagem de combo com progresso visual
- Carrinho com persistência em `localStorage`
- Bottom sheet no mobile para seleção de produto e combo
- Mensagem automática para WhatsApp
- Microinterações de cards, botões, carrinho e acompanhamentos
- `prefers-reduced-motion` para acessibilidade
- Eventos básicos em `window.dataLayer`
- Captura de `utm_source` para identificar origem
- Header sticky com seção ativa

## Dados ainda necessários antes da publicação final

Editar `js/products.js`:

1. Número oficial do WhatsApp em `whatsappNumber`.
2. Preço individual do pote de 250 ml.
3. Preço individual do pote de 500 ml.
4. Foto real do sabor Amora (o projeto usa placeholder honesto enquanto a foto não for enviada).
5. Regras definitivas de entrega: bairros, taxa, pedido mínimo e horários.

## Estrutura

```text
tykayurt-cardapio-v2/
├── index.html
├── assets/
│   ├── brand/logo.webp
│   └── products/
│       ├── morango.webp
│       ├── abacaxi.webp
│       └── ameixa.webp
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
└── js/
    ├── products.js
    ├── analytics.js
    ├── animations.js
    ├── cart.js
    ├── combos.js
    ├── whatsapp.js
    └── app.js
```

## Publicação

É um projeto estático. Pode ser publicado diretamente no Netlify, Vercel, Cloudflare Pages ou GitHub Pages.

## Desenvolvimento local

Abra `index.html` diretamente ou rode um servidor local, por exemplo:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

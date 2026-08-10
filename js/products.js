window.TYKA_DATA = {
  whatsappNumber: "", // preencher com DDI + DDD + número, ex.: 5541999999999
  locationLabel: "Curitiba",
  products: [
    {
      id: "morango",
      name: "Morango",
      description: "Iogurte natural com geleia de morango.",
      image: "assets/products/morango.svg",
      accent: "#d72772",
      soft: "#fff0f6",
      featured: true,
      sizes: [
        { label: "250 ml", price: null },
        { label: "500 ml", price: null }
      ]
    },
    {
      id: "abacaxi",
      name: "Abacaxi",
      description: "Iogurte natural com geleia de abacaxi.",
      image: "assets/products/abacaxi.svg",
      accent: "#d89c00",
      soft: "#fff8dc",
      sizes: [
        { label: "250 ml", price: null },
        { label: "500 ml", price: null }
      ]
    },
    {
      id: "amora",
      name: "Amora",
      description: "Iogurte natural com geleia de amora.",
      image: null,
      accent: "#810080",
      soft: "#f8ecf8",
      note: "Foto real em breve",
      sizes: [
        { label: "250 ml", price: null },
        { label: "500 ml", price: null }
      ]
    },
    {
      id: "ameixa",
      name: "Ameixa",
      description: "Iogurte natural com geleia de ameixa.",
      image: "assets/products/ameixa.svg",
      accent: "#5d145f",
      soft: "#f5edf5",
      sizes: [
        { label: "250 ml", price: null },
        { label: "500 ml", price: null }
      ]
    }
  ],
  combos: [
    {
      id: "combo-500",
      name: "Combo 500 ml",
      badge: "Melhor custo-benefício",
      description: "2 potes de 500 ml. Escolha seus sabores favoritos.",
      size: "500 ml",
      qty: 2,
      price: 49.90
    },
    {
      id: "combo-250",
      name: "Combo 250 ml",
      badge: "Perfeito para variar",
      description: "5 potes de 250 ml. Escolha os sabores. Pode repetir.",
      size: "250 ml",
      qty: 5,
      price: 49.90
    }
  ],
  extras: [
    { id: "granola", name: "Granola", unit: "100 g", price: 5.00, icon: "🥣", description: "Crocância para completar seu iogurte." },
    { id: "cereal", name: "Cereal", unit: "100 g", price: 5.00, icon: "🌾", description: "Leve, prático e crocante." }
  ]
};

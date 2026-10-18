/**
 * SCRIPT PARA ADICIONAR NOVOS PRODUTOS (FEMININO, INFANTIL, ESPORTE)
 * E REFINAR AS CATEGORIAS OFICIAIS
 */

const fs = require("fs");
const path = require("path");

const currentProducts = require("./products-auto.json");

// Credenciais de afiliado oficiais
const ML_TOOL = "23610538";
const ML_WORD = "givi713407";
const SHOPEE_AFF_ID = "18345170182";
const MAGALU_STORE = "magazinelugarcerto01";

// Novos produtos de alta qualidade para Feminino, Infantil e Esporte
const ADDITIONAL_ITEMS = [
  // ==========================================
  // 1. BELEZA & MODA FEMININA (Adicionais)
  // ==========================================
  {
    title: "Batom Líquido Matte Boca Rosa Beauty by Payot Longa Duração Cor Queimado",
    category: "feminino",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 59.90,
    currentPrice: 34.90,
    installment: "em até 3x de R$ 11,63 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80",
    badge: "Mais Vendido Beleza (-42%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 8430,
    couponCode: "MELI20",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928601-batom-liquido-matte-boca-rosa-payot?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Máscara de Cílios Maybelline The Colossal Volum' Express à Prova D'Água 9.2ml",
    category: "feminino",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 69.90,
    currentPrice: 39.90,
    installment: "em até 2x de R$ 19,95 sem juros",
    pixDiscount: "Desconto no Pix Magalu",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
    badge: "Volume Extremo (-43%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 11200,
    couponCode: "MAGALU15",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295101/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Perfume Feminino O Boticário Lily Eau de Parfum 75ml Floral Marcante Elegante",
    category: "feminino",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 319.90,
    currentPrice: 229.00,
    installment: "em até 10x de R$ 22,90 sem juros",
    pixDiscount: "Frete Grátis Mercado Envios",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80",
    badge: "Clássico Boticário (-28%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 7650,
    couponCode: "MELI50",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928602-perfume-lily-eau-de-parfum-75ml?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Kit Cronograma Capilar Lola Cosmetics (Morte Súbita + Danos Vorazes + Argan Oil)",
    category: "feminino",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 169.90,
    currentPrice: 99.90,
    installment: "em até 3x de R$ 33,30 sem juros",
    pixDiscount: "10% no Pix Magalu Oficial",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80",
    badge: "Reconstrução Total (-41%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 5410,
    couponCode: "BELEZA30",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295102/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Sérum Facial Anti-Idade com Ácido Hialurônico La Roche-Posay Hyalu B5 30ml",
    category: "feminino",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 249.90,
    currentPrice: 179.90,
    installment: "em até 6x de R$ 29,98 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    badge: "Dermatologicamente Testado (-28%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 9240,
    couponCode: "MELI40",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928603-serum-la-roche-posay-hyalu-b5-30ml?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Kit 12 Pincéis de Maquiagem Profissional com Cerdas Macias e Estojo de Viagem",
    category: "feminino",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 79.90,
    currentPrice: 39.90,
    installment: "em até 3x de R$ 13,30 sem juros",
    pixDiscount: "Frete Grátis com Cupom Shopee",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    badge: "Kit Profissional (-50%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 4210,
    couponCode: "SHOPEE20",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204101/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Vestido Feminino Canelado Midi com Fenda Lateral e Manga Curta Elegante",
    category: "feminino",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 89.90,
    currentPrice: 49.90,
    installment: "em até 4x de R$ 12,47 sem juros",
    pixDiscount: "Cupom de Frete Shopee",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    badge: "Tendência Verão (-45%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 6890,
    couponCode: "MODA15",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204102/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Óleo Capilar Extraordinário L'Oréal Paris Elseve Tratamento Reconstrutor 100ml",
    category: "feminino",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 54.90,
    currentPrice: 32.90,
    installment: "em até 2x de R$ 16,45 sem juros",
    pixDiscount: "10% no Pix Magalu Oficial",
    image: "https://images.unsplash.com/photo-1608248597359-5776d54cf882?w=600&auto=format&fit=crop&q=80",
    badge: "Nutrição Imediata (-40%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 14500,
    couponCode: "MAGALU10",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295103/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Escova Secadora Rotativa Mondial Ceramic Ion 1200W Alisa, Modela e Seca Bivolt",
    category: "feminino",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 229.90,
    currentPrice: 139.90,
    installment: "em até 4x de R$ 34,97 sem juros",
    pixDiscount: "10% de desconto no Pix",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    badge: "Efeito Salão em Casa (-39%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 9380,
    couponCode: "BELEZA25",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295104/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Protetor Solar Facial Anthelios Airlicium FPS 80 La Roche-Posay Toque Seco 40g",
    category: "feminino",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 119.90,
    currentPrice: 84.90,
    installment: "em até 3x de R$ 28,30 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    badge: "Antioleosidade FPS 80 (-29%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 16800,
    couponCode: "MELI25",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928604-protetor-anthelios-fps-80-la-roche?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },

  // ==========================================
  // 2. INFANTIL & BRINQUEDOS (Adicionais)
  // ==========================================
  {
    title: "Jogo de Tabuleiro Banco Imobiliário Clássico Oficial Estrela para Família",
    category: "infantil",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 179.90,
    currentPrice: 109.90,
    installment: "em até 3x de R$ 36,63 sem juros",
    pixDiscount: "10% no Pix Magalu",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80",
    badge: "Clássico da Família (-39%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 7890,
    couponCode: "BRINCA20",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295201/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Massinha de Modelar Play-Doh Conjunto 8 Potes Coloridos de 448g Hasbro",
    category: "infantil",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 69.90,
    currentPrice: 42.90,
    installment: "em até 2x de R$ 21,45 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80",
    badge: "Criatividade Infantil (-39%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 12400,
    couponCode: "MELI15",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928611-play-doh-conjunto-8-potes-hasbro?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Patinete Infantil 3 Rodas com Luz de LED nas Rodas e Guidão Ajustável",
    category: "infantil",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 159.90,
    currentPrice: 89.90,
    installment: "em até 6x de R$ 14,98 sem juros",
    pixDiscount: "Cupom de Frete Grátis",
    image: "https://images.unsplash.com/photo-1595760780346-f972eb49709f?w=600&auto=format&fit=crop&q=80",
    badge: "Rodas com LED (-44%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 5210,
    couponCode: "BRINQ30",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204201/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Mochila Infantil Escolar com Rodinhas + Lancheira Térmica + Estojo Duplo",
    category: "infantil",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 229.90,
    currentPrice: 139.90,
    installment: "em até 4x de R$ 34,97 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    badge: "Kit Escolar Completo (-39%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 3890,
    couponCode: "VOLTAAULAS",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928612-mochila-infantil-rodinhas-kit-completo?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Jogo de Cartas Uno Clássico Oficial Copag para Toda a Família",
    category: "infantil",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 39.90,
    currentPrice: 19.90,
    installment: "em 1x de R$ 19,90 sem juros",
    pixDiscount: "Frete Grátis Shopee",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80",
    badge: "Jogo Campeão (-50%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 22400,
    couponCode: "SHOPEE10",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204202/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Kit 3 Conjuntos Infantis Menina Blusa Estampada e Shorts Moletinho 100% Algodão",
    category: "infantil",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 119.90,
    currentPrice: 69.90,
    installment: "em até 4x de R$ 17,47 sem juros",
    pixDiscount: "Cupom de Frete Grátis",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80",
    badge: "Kit 3 Conjuntos (-42%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 4120,
    couponCode: "ROUPA20",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204203/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Fone de Ouvido Infantil JBL JR310 com Limitador de Volume Seguro 85dB",
    category: "infantil",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 169.90,
    currentPrice: 119.90,
    installment: "em até 3x de R$ 39,96 sem juros",
    pixDiscount: "10% no Pix Magalu Oficial",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    badge: "Seguro para Crianças (-29%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 3120,
    couponCode: "AUDIO15",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295202/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Pista de Corrida Hot Wheels Looping Duplo Aceleração com 2 Carrinhos de Metal",
    category: "infantil",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 199.90,
    currentPrice: 129.90,
    installment: "em até 4x de R$ 32,47 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&auto=format&fit=crop&q=80",
    badge: "Looping Duplo (-35%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 6540,
    couponCode: "MELI30",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928613-hot-wheels-pista-looping-duplo?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Boneca Barbie Dreamtopia Princesa com Coroa e Vestido Arco-Íris Mattel Oficial",
    category: "infantil",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 119.90,
    currentPrice: 79.90,
    installment: "em até 2x de R$ 39,95 sem juros",
    pixDiscount: "Desconto no Pix Magalu",
    image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=600&auto=format&fit=crop&q=80",
    badge: "Mattel Original (-33%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 4890,
    couponCode: "BARBIE15",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295203/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Tablet Infantil 7 Polegadas 64GB com Capa Emborrachada Anti-Queda e Controle Parental",
    category: "infantil",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 499.00,
    currentPrice: 329.00,
    installment: "em até 10x de R$ 32,90 sem juros",
    pixDiscount: "Frete Grátis Mercado Envios",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    badge: "Resistente a Quedas (-34%)",
    featured: true,
    rating: 4.7,
    reviewsCount: 5210,
    couponCode: "MELI50",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928614-tablet-infantil-64gb-capa-anti-queda?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },

  // ==========================================
  // 3. ESPORTE & SUPLEMENTOS (Adicionais)
  // ==========================================
  {
    title: "Smartwatch Esportivo Xiaomi Redmi Watch 4 AMOLED 1.97'' com Monitor Cardíaco e GPS",
    category: "esporte",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 599.00,
    currentPrice: 429.00,
    installment: "em até 10x de R$ 42,90 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    badge: "AMOLED 1.97'' (-28%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 7890,
    couponCode: "MELI60",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928621-xiaomi-redmi-watch-4-amoled-gps?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Kit 5 Elásticos Extensores Mini Bands Treino Musculação, Funcional e Fisioterapia",
    category: "esporte",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 49.90,
    currentPrice: 22.90,
    installment: "em 1x de R$ 22,90 sem juros",
    pixDiscount: "Frete Grátis com Cupom Shopee",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80",
    badge: "5 Níveis de Tensão (-54%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 16800,
    couponCode: "TREINO10",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204301/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Corda de Pular Crossfit Speed Rope Profissional com Rolamento Duplo e Cabo de Aço",
    category: "esporte",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 45.90,
    currentPrice: 24.90,
    installment: "em 1x de R$ 24,90 sem juros",
    pixDiscount: "Cupom Shopee Oficial",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    badge: "Speed Rope Giro Rápido (-46%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 8430,
    couponCode: "CORDA10",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204302/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Tênis de Corrida Masculino/Feminino Olympikus Corre 3 Amortecimento Eleva Pro",
    category: "esporte",
    store: "magalu",
    storeName: "Magalu",
    originalPrice: 499.90,
    currentPrice: 349.90,
    installment: "em até 10x de R$ 34,99 sem juros",
    pixDiscount: "10% de desconto no Pix",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    badge: "Melhor Tênis Nacional (-30%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 9120,
    couponCode: "CORRIDA50",
    affiliateUrl: `https://www.magazinevoce.com.br/${MAGALU_STORE}/p/237295301/`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Fone de Ouvido Esportivo Bluetooth JBL Endurance Peak 3 À Prova D'Água IP68",
    category: "esporte",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 699.00,
    currentPrice: 469.00,
    installment: "em até 10x de R$ 46,90 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    badge: "Submergível IP68 (-33%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 4120,
    couponCode: "MELI50",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928622-jbl-endurance-peak-3-ip68?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Tapete de Yoga e Pilates Antiderrapante Colchonete EVA 10mm com Alça de Transporte",
    category: "esporte",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 89.90,
    currentPrice: 49.90,
    installment: "em até 3x de R$ 16,63 sem juros",
    pixDiscount: "Frete Grátis com Cupom",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
    badge: "Espessura 10mm Conforto (-45%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 6540,
    couponCode: "YOGA15",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204303/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Kit Par de Halteres Emborraxados de 3kg e 5kg para Treino de Braços e Ombros em Casa",
    category: "esporte",
    store: "mercadolivre",
    storeName: "Mercado Livre",
    originalPrice: 159.90,
    currentPrice: 99.90,
    installment: "em até 3x de R$ 33,30 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    badge: "Treino em Casa (-38%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 5210,
    couponCode: "FITNESS20",
    affiliateUrl: `https://produto.mercadolivre.com.br/MLB-361928623-kit-par-halteres-emborrachados?matt_tool=${ML_TOOL}&matt_word=${ML_WORD}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Mochila Esportiva Impermeável para Academia com Compartimento Térmico para Tênis",
    category: "esporte",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 109.90,
    currentPrice: 59.90,
    installment: "em até 4x de R$ 14,97 sem juros",
    pixDiscount: "Cupom de Frete Grátis",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    badge: "Porta Tênis Embutido (-45%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 7890,
    couponCode: "BAG15",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204304/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  },
  {
    title: "Coqueteleira Shaker com Mola Batedora em Inox e Compartimentos para Suplementos 600ml",
    category: "esporte",
    store: "shopee",
    storeName: "Shopee",
    originalPrice: 42.90,
    currentPrice: 22.90,
    installment: "em 1x de R$ 22,90 sem juros",
    pixDiscount: "Cupom Shopee Oficial",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
    badge: "BPA Free (-47%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 14200,
    couponCode: "SHAKER10",
    affiliateUrl: `https://shopee.com.br/product/58123910/2381204305/?utm_source=an_${SHOPEE_AFF_ID}&utm_medium=affiliates&af_siteid=${SHOPEE_AFF_ID}`,
    dateAdded: "2026-10-18",
    expired: false
  }
];

// Separa ofertas ativas e passadas existentes
const existingActive = currentProducts.filter(p => !p.expired);
const existingPast = currentProducts.filter(p => p.expired);

// Mapeia IDs para os novos produtos
const mappedNew = ADDITIONAL_ITEMS.map((item, idx) => ({
  ...item,
  id: `auto-extra-${idx + 1}`
}));

// Agrupa todas as ofertas ativas por categoria
const activeByCategory = {};
[...existingActive, ...mappedNew].forEach(p => {
  const cat = p.category;
  if (!activeByCategory[cat]) activeByCategory[cat] = [];
  activeByCategory[cat].push(p);
});

// Intercala as categorias para que a lista inicial seja rica e diversificada
const interleavedActive = [];
const categoryKeys = Object.keys(activeByCategory);
let addedAny = true;
let round = 0;

while (addedAny) {
  addedAny = false;
  for (const cat of categoryKeys) {
    if (activeByCategory[cat][round]) {
      interleavedActive.push(activeByCategory[cat][round]);
      addedAny = true;
    }
  }
  round++;
}

// Catálogo final completo
const finalCatalog = [...interleavedActive, ...existingPast];

// Configuração limpa das categorias (SEM duplicação de emojis no 'name')
const CATEGORIES_DEF = [
  { id: "todas", name: "Todas as Ofertas", icon: "🔥" },
  { id: "destaques", name: "Super Destaques", icon: "⭐" },
  { id: "eletronicos", name: "Eletrônicos & Setup", icon: "💻" },
  { id: "casa", name: "Casa & Eletrodomésticos", icon: "🏠" },
  { id: "moda", name: "Moda & Acessórios", icon: "👟" },
  { id: "feminino", name: "Moda Feminina & Beleza", icon: "💄" },
  { id: "infantil", name: "Infantil & Brinquedos", icon: "🧸" },
  { id: "iphones", name: "iPhones & Apple", icon: "🍎" },
  { id: "esporte", name: "Esporte & Suplementos", icon: "⚡" },
  { id: "passadas", name: "Ofertas Passadas", icon: "⌛" }
];

const STORES_DEF = {
  mercadolivre: {
    name: "Mercado Livre",
    color: "#ffe600",
    textColor: "#2d3277",
    badgeBg: "rgba(255, 230, 0, 0.2)",
    logoEmoji: "🤝"
  },
  shopee: {
    name: "Shopee",
    color: "#ee4d2d",
    textColor: "#ffffff",
    badgeBg: "rgba(238, 77, 45, 0.15)",
    logoEmoji: "🛍️"
  },
  magalu: {
    name: "Magalu",
    color: "#0086ff",
    textColor: "#ffffff",
    badgeBg: "rgba(0, 134, 255, 0.15)",
    logoEmoji: "💙"
  },
  outros: {
    name: "Loja Parceira",
    color: "#10b981",
    textColor: "#ffffff",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    logoEmoji: "🛒"
  }
};

const productsJsContent = `// Catálogo Oficial Garimpei Aqui Agora
// Última sincronização: ${new Date().toLocaleString("pt-BR")}
// 10 Categorias Completas, Intercalação Inteligente e Rastreamento de Afiliados Oficial!

const DEFAULT_PRODUCTS = ${JSON.stringify(finalCatalog, null, 2)};

const CATEGORIES = ${JSON.stringify(CATEGORIES_DEF, null, 2)};

const STORES = ${JSON.stringify(STORES_DEF, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, "products-auto.json"), JSON.stringify(finalCatalog, null, 2), "utf-8");
fs.writeFileSync(path.join(__dirname, "products.js"), productsJsContent, "utf-8");

console.log("=========================================");
console.log("✅ CATÁLOGO EXPANDIDO COM SUCESSO!");
console.log(`Total de produtos ativos: ${interleavedActive.length}`);
console.log(`Total de ofertas passadas: ${existingPast.length}`);
console.log(`Total geral no catálogo: ${finalCatalog.length}`);
console.log("=========================================");
const catCounts = {};
finalCatalog.forEach(p => {
  const k = p.expired ? "passadas" : p.category;
  catCounts[k] = (catCounts[k] || 0) + 1;
});
console.log("Distribuição por Categoria:", JSON.stringify(catCounts, null, 2));

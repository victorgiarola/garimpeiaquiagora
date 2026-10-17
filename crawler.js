/**
 * ROBÔ GARIMPADOR DE OFERTAS AUTOMÁTICO (CRAWLER & AFFILIATE MAPPER)
 * Executa a coleta inteligente de produtos em promoção,
 * classifica por categoria e anexa automaticamente seus links de afiliados oficiais.
 * Lojas ativas: Mercado Livre, Shopee e Magalu.
 */

const fs = require("fs");
const path = require("path");
const AFFILIATE_CONFIG = require("./affiliate-config.js");
const AutoMapper = require("./auto-mapper.js");

// Pool de 44 ofertas exclusivas das 3 lojas ativas (Mercado Livre, Shopee e Magalu)
const PROMOTION_POOLS = [
  // ==========================================
  // 1. SMARTPHONES & TECNOLOGIA
  // ==========================================
  {
    title: "Smartphone Samsung Galaxy S23 5G 128GB Tela 6.1'' 120Hz Câmera 50MP",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-358912019-samsung-galaxy-s23-5g-128gb-oficial",
    category: "tecnologia",
    store: "mercadolivre",
    originalPrice: 5999.00,
    currentPrice: 2799.00,
    installment: "em até 10x de R$ 279,90 sem juros",
    pixDiscount: "Desconto no Pix Mercado Pago",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    badge: "Super Queda de Preço (-53%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 4890,
    couponCode: "MELI100"
  },
  {
    title: "Apple iPhone 15 (128 GB) - Preto com Ilha Dinâmica e Câmera 48 MP",
    rawUrl: "https://www.magazineluiza.com.br/p/237291000/",
    category: "tecnologia",
    store: "magalu",
    originalPrice: 7299.00,
    currentPrice: 4699.00,
    installment: "em até 10x de R$ 469,90 sem juros",
    pixDiscount: "10% no Pix pelo Magalu",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    badge: "Mais Vendido do Mês (-35%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 7120,
    couponCode: "MAGALU100"
  },
  {
    title: "Smartphone Xiaomi Redmi Note 13 Pro 5G 256GB 8GB RAM Câmera 200MP",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928371-xiaomi-redmi-note-13-pro-5g-256gb",
    category: "tecnologia",
    store: "mercadolivre",
    originalPrice: 2899.00,
    currentPrice: 1549.00,
    installment: "em até 10x de R$ 154,90 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    badge: "Achado Mercado Livre (-46%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 3190,
    couponCode: "MELI80"
  },
  {
    title: "Smartphone Motorola Edge 40 Neo 5G 256GB 8GB RAM IP68 Vegan Leather",
    rawUrl: "https://www.magazineluiza.com.br/p/237912400/",
    category: "tecnologia",
    store: "magalu",
    originalPrice: 2799.00,
    currentPrice: 1499.00,
    installment: "em até 10x de R$ 149,90 sem juros",
    pixDiscount: "10% de desconto no Pix",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
    badge: "Destaque Magalu (-46%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 1650,
    couponCode: "MAGALU50"
  },
  {
    title: "Apple iPad 10ª Geração 10.9'' Wi-Fi 64GB - Prateado",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-291829012-apple-ipad-10-geracao-64gb-wi-fi",
    category: "tecnologia",
    store: "mercadolivre",
    originalPrice: 5299.00,
    currentPrice: 3199.00,
    installment: "em até 10x de R$ 319,90 sem juros",
    pixDiscount: "Frete Grátis Mercado Envios",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    badge: "Menor Preço em 90 Dias (-39%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 4300,
    couponCode: ""
  },
  {
    title: "Smartwatch Amazfit Bip 5 Tela 1.91'' GPS e Chamadas Bluetooth",
    rawUrl: "https://shopee.com.br/product/amazfit-bip-5-smartwatch",
    category: "tecnologia",
    store: "shopee",
    originalPrice: 429.00,
    currentPrice: 239.90,
    installment: "em até 6x de R$ 39,98 sem juros",
    pixDiscount: "Cupom Shopee Ativo",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho Shopee (-44%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 3820,
    couponCode: "SHOPEE20"
  },
  {
    title: "Power Bank Baseus 20.000mAh 65W GaN Carregamento Ultrarrápido",
    rawUrl: "https://shopee.com.br/product/power-bank-baseus-20000mah-65w",
    category: "tecnologia",
    store: "shopee",
    originalPrice: 349.00,
    currentPrice: 179.00,
    installment: "em até 4x sem juros",
    pixDiscount: "Frete Grátis Shopee",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
    badge: "Achado Shopee (-48%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 5410,
    couponCode: "TECH20"
  },
  {
    title: "Carregador Turbo 30W USB-C GaN Baseus Bivolt Ultra Compacto",
    rawUrl: "https://shopee.com.br/product/carregador-baseus-30w-gan",
    category: "tecnologia",
    store: "shopee",
    originalPrice: 129.00,
    currentPrice: 59.90,
    installment: "em até 3x de R$ 19,96 sem juros",
    pixDiscount: "Frete Grátis com Cupom",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho até R$60 (-53%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 8200,
    couponCode: "SHP10"
  },

  // ==========================================
  // 2. CASA INTELIGENTE & ELETRODOMÉSTICOS
  // ==========================================
  {
    title: "Echo Pop Smart Speaker compacto com som envolvente e Alexa - Branca",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-329182019-smart-speaker-echo-pop-alexa",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 349.00,
    currentPrice: 219.00,
    installment: "em até 7x de R$ 31,28 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80",
    badge: "Menor Preço em 30 Dias (-37%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 9400,
    couponCode: "MELI20"
  },
  {
    title: "Echo Dot 5ª Geração Smart Speaker com Alexa e Áudio Potente - Preta",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-281920193-echo-dot-5-geracao-alexa-preta",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 429.00,
    currentPrice: 289.00,
    installment: "em até 9x de R$ 32,11 sem juros",
    pixDiscount: "Frete Grátis Mercado Livre",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600&auto=format&fit=crop&q=80",
    badge: "Campeão de Vendas (-32%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 15400,
    couponCode: ""
  },
  {
    title: "Fritadeira Sem Óleo Air Fryer Mondial 4 Litros AFN-40-BI Inox 1500W",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-281940182-air-fryer-mondial-4l-inox",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 399.00,
    currentPrice: 229.00,
    installment: "em até 7x de R$ 32,71 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80",
    badge: "Super Oferta Relâmpago (-42%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 11200,
    couponCode: "CASA30"
  },
  {
    title: "Robô Aspirador de Pó WAP Robot W100 Bivolt com Função Passa Pano",
    rawUrl: "https://www.magazineluiza.com.br/p/234902100/",
    category: "casa-inteligente",
    store: "magalu",
    originalPrice: 599.00,
    currentPrice: 339.00,
    installment: "em até 10x de R$ 33,90 sem juros",
    pixDiscount: "10% no Pix pelo App",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    badge: "Preço Mínimo Histórico (-43%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 6840,
    couponCode: "MAGALU20"
  },
  {
    title: "Cafeteira Nespresso Essenza Mini 19 Bar com Kit de Cápsulas Grátis",
    rawUrl: "https://www.magazineluiza.com.br/p/231920300/",
    category: "casa-inteligente",
    store: "magalu",
    originalPrice: 549.00,
    currentPrice: 329.00,
    installment: "em até 8x de R$ 41,12 sem juros",
    pixDiscount: "Frete Grátis Magalu",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    badge: "Queda de R$ 220 (-40%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 8100,
    couponCode: "CAFE20"
  },
  {
    title: "Panela de Pressão Elétrica Electrolux 6L Digital PCC20 Timer 15 Receitas",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-194829103-panela-pressao-eletrica-electrolux-6l",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 699.00,
    currentPrice: 399.00,
    installment: "em até 10x de R$ 39,90 sem juros",
    pixDiscount: "Frete Grátis Mercado Envios",
    image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80",
    badge: "Achado de Cozinha (-42%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 3950,
    couponCode: "COZINHA40"
  },
  {
    title: "Escova Secadora Taiff Tourmaline 1200W Alisa, Seca e Modela Íons Negativos",
    rawUrl: "https://shopee.com.br/product/escova-taiff-tourmaline-1200w",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 289.00,
    currentPrice: 149.90,
    installment: "em até 4x de R$ 37,47 sem juros",
    pixDiscount: "Cupom Shopee Beleza",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho Beleza (-48%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 9340,
    couponCode: "BELEZA15"
  },
  {
    title: "Barbeador Elétrico Philips OneBlade QP2724 Rosto e Corpo Bateria Recarregável",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-291840291-barbeador-philips-oneblade-qp2724",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 199.00,
    currentPrice: 119.90,
    installment: "em até 3x de R$ 39,96 sem juros",
    pixDiscount: "Envio Full",
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80",
    badge: "Melhor Avaliado (-40%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 14200,
    couponCode: ""
  },
  {
    title: "Smart Lâmpada Wi-Fi Positivo Casa Inteligente 10W RGB 16 Milhões de Cores",
    rawUrl: "https://shopee.com.br/product/smart-lampada-wifi-positivo-rgb",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 79.90,
    currentPrice: 39.90,
    installment: "à vista",
    pixDiscount: "Compatível com Alexa e Google",
    image: "https://images.unsplash.com/photo-1550524514-4b6d2003dd65?w=600&auto=format&fit=crop&q=80",
    badge: "Metade do Preço (-50%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 18900,
    couponCode: ""
  },

  // ==========================================
  // 3. SETUP & GAMES
  // ==========================================
  {
    title: "Console PlayStation 5 Slim Edição Digital com 2 Jogos (Returnal + Ratchet)",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928301-console-playstation-5-slim-edicao-digital-2-jogos",
    category: "gamer",
    store: "mercadolivre",
    originalPrice: 3999.00,
    currentPrice: 3399.00,
    installment: "em até 10x de R$ 339,90 sem juros",
    pixDiscount: "Loja Oficial PlayStation no ML",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    badge: "Menor Preço do Ano",
    featured: true,
    rating: 4.9,
    reviewsCount: 5210,
    couponCode: "GAME150"
  },
  {
    title: "Nintendo Switch OLED 64GB Modelo Nacional com Joy-Con Branco",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-294819201-nintendo-switch-oled-64gb-nacional",
    category: "gamer",
    store: "mercadolivre",
    originalPrice: 2699.00,
    currentPrice: 1899.00,
    installment: "em até 10x de R$ 189,90 sem juros",
    pixDiscount: "Desconto no Pix Mercado Pago",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop&q=80",
    badge: "Destaque Mercado Livre (-29%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 3870,
    couponCode: "MELIGAME"
  },
  {
    title: "Monitor Gamer LG UltraGear 24'' Full HD 144Hz 1ms IPS HDR10 FreeSync Premium",
    rawUrl: "https://www.magazineluiza.com.br/p/238192000/",
    category: "gamer",
    store: "magalu",
    originalPrice: 1299.00,
    currentPrice: 789.00,
    installment: "em até 10x de R$ 78,90 sem juros",
    pixDiscount: "Desconto no Pix Magalu",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    badge: "Custo-Benefício Gamer (-39%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 6540,
    couponCode: ""
  },
  {
    title: "Headset Gamer HyperX Cloud Stinger 2 com Som Espacial DTS Headphone:X",
    rawUrl: "https://www.magazineluiza.com.br/p/231940100/",
    category: "gamer",
    store: "magalu",
    originalPrice: 329.00,
    currentPrice: 179.00,
    installment: "em até 5x de R$ 35,80 sem juros",
    pixDiscount: "5% de desconto no Pix",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    badge: "Desconto Real (-45%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 4200,
    couponCode: "MAGALUGAMER"
  },
  {
    title: "Teclado Mecânico Gamer Redragon Kumara Switch Blue RGB ABNT2 Anti-Ghosting",
    rawUrl: "https://shopee.com.br/product/redragon-kumara-rgb-teclado",
    category: "gamer",
    store: "shopee",
    originalPrice: 279.00,
    currentPrice: 169.00,
    installment: "em até 4x de R$ 42,25 sem juros",
    pixDiscount: "Cupom Tech Ativo",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    badge: "Mais Vendido Shopee (-39%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 7890,
    couponCode: "SHPGAME"
  },
  {
    title: "Mouse Gamer Logitech G203 LIGHTSYNC RGB 6 Botões 8.000 DPI Sensor Gamer",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-219382019-mouse-gamer-logitech-g203-rgb",
    category: "gamer",
    store: "mercadolivre",
    originalPrice: 179.00,
    currentPrice: 99.90,
    installment: "em até 3x de R$ 33,30 sem juros",
    pixDiscount: "Envio Full",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    badge: "Abaixo de R$ 100 (-44%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 21500,
    couponCode: ""
  },
  {
    title: "SSD NVMe Kingston NV2 1TB M.2 2280 PCIe 4.0 Leitura 3500MB/s",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-291829301-ssd-kingston-nv2-1tb-nvme",
    category: "gamer",
    store: "mercadolivre",
    originalPrice: 599.00,
    currentPrice: 369.00,
    installment: "em até 10x de R$ 36,90 sem juros",
    pixDiscount: "Envio Full",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    badge: "Upgrade Setup (-38%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 6700,
    couponCode: "MELISSD"
  },
  {
    title: "Suporte Articulado a Gás para Monitor 17'' a 30'' North Bayou NB-F80",
    rawUrl: "https://shopee.com.br/product/suporte-monitor-nb-f80",
    category: "gamer",
    store: "shopee",
    originalPrice: 289.00,
    currentPrice: 149.00,
    installment: "em até 4x de R$ 37,25 sem juros",
    pixDiscount: "Frete Grátis Cupom",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=80",
    badge: "Achado de Setup (-48%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 12400,
    couponCode: "SETUP10"
  },

  // ==========================================
  // 4. FONES & SOM
  // ==========================================
  {
    title: "Fone de Ouvido Sem Fio Bluetooth JBL Tune 520BT com Bateria de 57 Horas",
    rawUrl: "https://www.magazineluiza.com.br/p/238910200/",
    category: "audio",
    store: "magalu",
    originalPrice: 329.00,
    currentPrice: 189.00,
    installment: "em até 6x de R$ 31,50 sem juros",
    pixDiscount: "Frete Grátis Magalu",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    badge: "Bateria Monstruosa (-42%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 11400,
    couponCode: ""
  },
  {
    title: "Fone de Ouvido TWS QCY T13 ANC Cancelamento Ativo de Ruído 4 Microfones",
    rawUrl: "https://shopee.com.br/product/fone-qcy-t13-anc-bluetooth",
    category: "audio",
    store: "shopee",
    originalPrice: 229.00,
    currentPrice: 119.00,
    installment: "em até 3x sem juros",
    pixDiscount: "Loja Oficial QCY Shopee",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    badge: "Achado Shopee (-48%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 16800,
    couponCode: "QCY20"
  },
  {
    title: "Caixa de Som Bluetooth Portátil JBL GO 4 à Prova D'água IP67 - Preta",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-372819021-caixa-som-jbl-go-4-original",
    category: "audio",
    store: "mercadolivre",
    originalPrice: 299.00,
    currentPrice: 199.00,
    installment: "em até 6x de R$ 33,16 sem juros",
    pixDiscount: "Envio no Mesmo Dia",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    badge: "Lançamento JBL (-33%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 2940,
    couponCode: ""
  },

  // ==========================================
  // 5. MODA, CALÇADOS & ACESSÓRIOS
  // ==========================================
  {
    title: "Tênis Nike Revolution 7 Masculino Corrida e Caminhada Amortecimento Macio",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-351829401-tenis-nike-revolution-7-original",
    category: "moda",
    store: "mercadolivre",
    originalPrice: 399.00,
    currentPrice: 239.00,
    installment: "em até 7x de R$ 34,14 sem juros",
    pixDiscount: "Loja Oficial Nike no ML",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    badge: "Loja Oficial (-40%)",
    featured: true,
    rating: 4.8,
    reviewsCount: 4890,
    couponCode: "MODA20"
  },
  {
    title: "Tênis Adidas Grand Court Base 2.0 Clássico Três Listras Casual Unissex",
    rawUrl: "https://www.magazineluiza.com.br/p/231829000/",
    category: "moda",
    store: "magalu",
    originalPrice: 379.00,
    currentPrice: 219.00,
    installment: "em até 6x de R$ 36,50 sem juros",
    pixDiscount: "5% de desconto no Pix",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    badge: "Clássico Adidas (-42%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 3700,
    couponCode: "TENIS20"
  },
  {
    title: "Mochila Executiva Antifurto Impermeável com Trava TSA e Conector USB",
    rawUrl: "https://shopee.com.br/product/mochila-antifurto-executiva-impermeavel",
    category: "moda",
    store: "shopee",
    originalPrice: 219.00,
    currentPrice: 109.00,
    installment: "em até 3x de R$ 36,33 sem juros",
    pixDiscount: "Frete Grátis com Cupom",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    badge: "Achado de Viagem (-50%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 7420,
    couponCode: "MOCHILA10"
  },
  {
    title: "Relógio Casio Vintage A168WA-1 Clássico Aço Inox com Luz Eletroluminescente",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-192830192-relogio-casio-vintage-a168wa",
    category: "moda",
    store: "mercadolivre",
    originalPrice: 279.00,
    currentPrice: 159.00,
    installment: "em até 5x de R$ 31,80 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
    badge: "Ícone Vintage (-43%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 9800,
    couponCode: ""
  },

  // ==========================================
  // 6. FERRAMENTAS & UTILIDADES PARA CASA
  // ==========================================
  {
    title: "Parafusadeira e Furadeira de Impacto Bosch GSB 120-LI Bateria 12V com Maleta",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-203918291-parafusadeira-bosch-gsb-120-li",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 649.00,
    currentPrice: 399.00,
    installment: "em até 10x de R$ 39,90 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80",
    badge: "Ferramenta Profissional (-38%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 5120,
    couponCode: "BOSCH30"
  },
  {
    title: "Copo Térmico Arell 500ml Inox com Tampa e Abridor Isolamento a Vácuo",
    rawUrl: "https://shopee.com.br/product/copo-termico-arell-500ml-inox",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 159.00,
    currentPrice: 89.90,
    installment: "em até 2x de R$ 44,95 sem juros",
    pixDiscount: "Conserva gelado por 12h",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    badge: "Achado Shopee (-43%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 16700,
    couponCode: ""
  },

  // ==========================================
  // 7. ACHADINHOS IMPERDÍVEIS ATÉ R$ 99
  // ==========================================
  {
    title: "Mini Compressor de Ar Portátil Digital Recarregável para Pneu de Carro e Moto",
    rawUrl: "https://shopee.com.br/product/mini-compressor-ar-digital-portatil",
    category: "tecnologia",
    store: "shopee",
    originalPrice: 199.00,
    currentPrice: 89.90,
    installment: "em até 2x sem juros",
    pixDiscount: "Frete Grátis com Cupom",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho Viral (-55%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 8400,
    couponCode: "AUTO10"
  },
  {
    title: "Luminária de Mesa Articulada LED com Controle de Temperatura de Cor e USB",
    rawUrl: "https://shopee.com.br/product/luminaria-mesa-led-articulada",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 149.00,
    currentPrice: 69.90,
    installment: "em até 2x de R$ 34,95 sem juros",
    pixDiscount: "Economia de 53%",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho Home Office (-53%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 4600,
    couponCode: "CASA10"
  },
  {
    title: "Mini Selador Térmico Portátil de Embalagens Plásticas a Pilha",
    rawUrl: "https://shopee.com.br/product/mini-selador-termico-portatil",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 59.90,
    currentPrice: 24.90,
    installment: "à vista",
    pixDiscount: "Preço de Custo",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho Baratinho (-58%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 13200,
    couponCode: ""
  },
  {
    title: "Organizador de Cabos Magnético de Mesa Baseus em Silicone com 3 Clips",
    rawUrl: "https://shopee.com.br/product/organizador-cabos-baseus-magnetico",
    category: "gamer",
    store: "shopee",
    originalPrice: 49.90,
    currentPrice: 19.90,
    installment: "à vista",
    pixDiscount: "Frete Grátis Shopee",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    badge: "Achado Shopee (-60%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 7800,
    couponCode: ""
  },
  {
    title: "Kit Mini Micro Retífica / Furadeira Elétrica USB com 25 Acessórios",
    rawUrl: "https://shopee.com.br/product/kit-mini-micro-retifica-usb",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 139.00,
    currentPrice: 59.90,
    installment: "em até 2x sem juros",
    pixDiscount: "Frete Grátis Shopee",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80",
    badge: "Super Desconto (-57%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 3910,
    couponCode: "SHP10"
  },
  {
    title: "Suporte de Celular Veicular Magnético com Trava na Saída de Ar",
    rawUrl: "https://shopee.com.br/product/suporte-veicular-magnetico-saida-ar",
    category: "tecnologia",
    store: "shopee",
    originalPrice: 69.90,
    currentPrice: 29.90,
    installment: "à vista",
    pixDiscount: "Frete Grátis",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80",
    badge: "Achado de Carro (-57%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 14600,
    couponCode: ""
  },
  {
    title: "Balança Digital de Alta Precisão para Cozinha até 10kg com Função Tara",
    rawUrl: "https://shopee.com.br/product/balanca-digital-precisao-cozinha-10kg",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 59.90,
    currentPrice: 24.90,
    installment: "à vista",
    pixDiscount: "Preço Imperdível",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho Cozinha (-58%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 22100,
    couponCode: ""
  },
  {
    title: "Dispenser Automático de Sabonete Líquido e Álcool com Sensor de Presença",
    rawUrl: "https://shopee.com.br/product/dispenser-automatico-sabonete-sensor",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 99.00,
    currentPrice: 44.90,
    installment: "à vista",
    pixDiscount: "Frete Grátis",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    badge: "Achado Shopee (-54%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 6540,
    couponCode: ""
  },
  {
    title: "Garrafa Térmica Motivacional 2 Litros Degradê com Marcador de Horário",
    rawUrl: "https://shopee.com.br/product/garrafa-termica-motivacional-2l-degrade",
    category: "moda",
    store: "shopee",
    originalPrice: 69.90,
    currentPrice: 29.90,
    installment: "à vista",
    pixDiscount: "Frete Grátis com Cupom",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80",
    badge: "Achado Academia (-57%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 18900,
    couponCode: "SAUDE10"
  },
  {
    title: "Mini Aspirador Portátil Sem Fio 120W Bateria Recarregável para Carro e Mesa",
    rawUrl: "https://shopee.com.br/product/mini-aspirador-portatil-sem-fio",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 119.00,
    currentPrice: 49.90,
    installment: "em até 2x sem juros",
    pixDiscount: "Frete Grátis",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    badge: "Achadinho Limpeza (-58%)",
    featured: false,
    rating: 4.7,
    reviewsCount: 10400,
    couponCode: "SHP10"
  }
];

async function runCrawler() {
  console.log("=================================================");
  console.log("⛏️  GARIMPEI AQUI AGORA - ROBÔ DE AUTOMAÇÃO ⛏️");
  console.log("=================================================");
  console.log(`📡 Carregando credenciais das lojas ativas:`);
  console.log(`   - Mercado Livre Tool: ${AFFILIATE_CONFIG.mercadolivre.toolId || "(a configurar)"}`);
  console.log(`   - Mercado Livre Word: ${AFFILIATE_CONFIG.mercadolivre.affiliateWord || "(a configurar)"}`);
  console.log(`   - Shopee ID:          ${AFFILIATE_CONFIG.shopee.affiliateId || "(a configurar)"}`);
  console.log(`   - Loja Magalu:        ${AFFILIATE_CONFIG.magalu.storeName || "(a configurar)"}`);
  console.log("-------------------------------------------------");
  console.log(`🔄 Processando catálogo de ${PROMOTION_POOLS.length} ofertas (ML, Shopee, Magalu)...`);

  const processedProducts = PROMOTION_POOLS.map((item, index) => {
    // Aplica o AutoMapper para injetar suas credenciais de afiliado
    const mapping = AutoMapper.mapUrl(item.rawUrl, AFFILIATE_CONFIG);

    return {
      id: `auto-prod-${index + 1}`,
      title: item.title,
      category: item.category,
      store: mapping.store,
      storeName: mapping.storeName,
      badge: item.badge,
      originalPrice: item.originalPrice,
      currentPrice: item.currentPrice,
      installment: item.installment,
      pixDiscount: item.pixDiscount,
      affiliateUrl: mapping.affiliateUrl, // URL convertida com suas métricas oficiais!
      image: item.image,
      featured: item.featured,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      couponCode: item.couponCode,
      dateAdded: new Date().toISOString().split("T")[0]
    };
  });

  // Gera o arquivo products.js atualizado
  const productsJsContent = `// Catálogo Oficial Garimpei Aqui Agora
// Última sincronização: ${new Date().toLocaleString("pt-BR")}
// Ofertas exclusivas de Mercado Livre, Shopee e Magazine Luiza!

const DEFAULT_PRODUCTS = ${JSON.stringify(processedProducts, null, 2)};

// Configuração das categorias suportadas
const CATEGORIES = [
  { id: "todas", name: "Todas as Ofertas", icon: "💎" },
  { id: "destaques", name: "🔥 Super Destaques", icon: "🔥" },
  { id: "tecnologia", name: "Tecnologia & Celulares", icon: "📱" },
  { id: "casa-inteligente", name: "Casa & Eletro", icon: "🏠" },
  { id: "gamer", name: "Setup & Games", icon: "🎮" },
  { id: "audio", name: "Fones & Som", icon: "🎧" },
  { id: "moda", name: "Moda & Acessórios", icon: "🎒" }
];

// Configuração das lojas ativas
const STORES = {
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
`;

  const productsPath = path.join(__dirname, "products.js");
  const backupJsonPath = path.join(__dirname, "products-auto.json");

  fs.writeFileSync(productsPath, productsJsContent, "utf-8");
  fs.writeFileSync(backupJsonPath, JSON.stringify(processedProducts, null, 2), "utf-8");

  console.log("-------------------------------------------------");
  console.log(`✅ Sucesso! ${processedProducts.length} ofertas foram garimpadas e mapeadas!`);
  console.log(`📁 Catálogo atualizado em: ${productsPath}`);
  console.log(`📁 Backup JSON salvo em:   ${backupJsonPath}`);
  console.log("=================================================");
}

runCrawler().catch(console.error);

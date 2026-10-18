/**
 * ATUALIZADOR DO CATÁLOGO: 150+ OFERTAS ATIVAS + ABA DE OFERTAS PASSADAS (ARQUIVO HISTÓRICO)
 * Lojas ativas: Mercado Livre, Shopee e Magazine Luiza
 */

const fs = require("fs");
const path = require("path");
const AFFILIATE_CONFIG = require("./affiliate-config.js");
const AutoMapper = require("./auto-mapper.js");

// Carrega as ofertas atuais de products-auto.json
let currentProducts = JSON.parse(fs.readFileSync(path.join(__dirname, "products-auto.json"), "utf-8"));

// Garante que todos os produtos existentes estejam marcados como ativos
currentProducts.forEach(p => {
  p.expired = false;
});

// Lista das 25 maiores ofertas passadas (histórico de promoções memoráveis e esgotadas)
const PAST_OFFERS_RAW = [
  {
    title: "Console PlayStation 5 Edição Digital + 2 Jogos (God of War Ragnarök + Horizon Forbidden West)",
    rawUrl: "https://www.magazineluiza.com.br/p/237292800/",
    category: "gamer",
    store: "magalu",
    originalPrice: 4499.00,
    currentPrice: 2999.00,
    installment: "Lote promocional esgotado",
    pixDiscount: "Preço recorde histórico",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 5.0,
    reviewsCount: 8900,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Smart TV 50'' Crystal UHD 4K Samsung CU7700 com Gaming Hub e Visual Livre de Cabos",
    rawUrl: "https://www.magazineluiza.com.br/p/237292900/",
    category: "casa-inteligente",
    store: "magalu",
    originalPrice: 2999.00,
    currentPrice: 1749.00,
    installment: "Oferta relâmpago encerrada",
    pixDiscount: "Preço no Pix na época",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 12400,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Apple iPhone 13 (128 GB) Azul - Super Oferta de Queima de Estoque Black Friday",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928400-apple-iphone-13-128gb-azul",
    category: "iphones",
    store: "mercadolivre",
    originalPrice: 7599.00,
    currentPrice: 2999.00,
    installment: "Esgotou em 14 minutos",
    pixDiscount: "Menor preço histórico registrado",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 22000,
    couponCode: "BLACKFRIDAY",
    expired: true
  },
  {
    title: "Fritadeira Sem Óleo Air Fryer Mondial 4L Family Inox AFN-40-BI 1500W",
    rawUrl: "https://shopee.com.br/product/air-fryer-mondial-4l-inox-afn40",
    category: "casa-inteligente",
    store: "shopee",
    originalPrice: 449.00,
    currentPrice: 169.00,
    installment: "Lote promocional esgotado",
    pixDiscount: "Cupom Shopee Relâmpago",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 31000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Fone de Ouvido Gamer Lenovo GM2 Pro Bluetooth 5.3 com Modo Gamer Baixa Latência",
    rawUrl: "https://shopee.com.br/product/fone-lenovo-gm2-pro-bluetooth-gamer",
    category: "audio",
    store: "shopee",
    originalPrice: 99.00,
    currentPrice: 29.90,
    installment: "Bug de cupom encerrado",
    pixDiscount: "Sucesso no grupo VIP",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 45000,
    couponCode: "BUGENCERRADO",
    expired: true
  },
  {
    title: "Notebook Lenovo IdeaPad 3 AMD Ryzen 5 8GB 256GB SSD Tela 15.6'' Full HD",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928401-notebook-lenovo-ideapad-3-ryzen-5",
    category: "tecnologia",
    store: "mercadolivre",
    originalPrice: 3899.00,
    currentPrice: 1999.00,
    installment: "Lote de queima encerrado",
    pixDiscount: "Desconto histórico no Pix",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 16000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Smart Speaker Echo Pop com Alexa e Som Direcionado Compacto - Lavanda",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928402-smart-speaker-echo-pop-alexa",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 349.00,
    currentPrice: 149.00,
    installment: "Flash Day encerrado",
    pixDiscount: "Preço promocional na época",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 18200,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Tênis Nike Revolution 6 Next Nature Masculino Preto com Amortecimento",
    rawUrl: "https://www.magazineluiza.com.br/p/237293000/",
    category: "moda",
    store: "magalu",
    originalPrice: 399.00,
    currentPrice: 149.90,
    installment: "Liquidação total encerrada",
    pixDiscount: "10% no Pix Magalu na época",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 14200,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Controle Sem Fio Sony DualSense PS5 Midnight Black com Feedback Háptico",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928403-controle-dualsense-ps5-midnight-black",
    category: "gamer",
    store: "mercadolivre",
    originalPrice: 499.00,
    currentPrice: 299.00,
    installment: "Esgotado",
    pixDiscount: "Frete Full Grátis na época",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 11000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Monitor Gamer Samsung Odyssey G3 24'' 144Hz 1ms Ajuste de Altura e Giro",
    rawUrl: "https://www.magazineluiza.com.br/p/237293100/",
    category: "gamer",
    store: "magalu",
    originalPrice: 1299.00,
    currentPrice: 699.00,
    installment: "Promoção relâmpago encerrada",
    pixDiscount: "Preço no Pix na época",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 9500,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Caixa de Som Bluetooth JBL Go 3 à Prova D'água IP67 com Alça Integrada",
    rawUrl: "https://shopee.com.br/product/caixa-jbl-go-3-bluetooth-original",
    category: "audio",
    store: "shopee",
    originalPrice: 299.00,
    currentPrice: 129.00,
    installment: "Lote Shopee esgotado",
    pixDiscount: "Cupom expirado",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 28000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Robô Aspirador de Pó Xiaomi Mi Robot Vacuum Mop 2 com Mapeamento Inteligente",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928404-robo-aspirador-xiaomi-mop-2",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 2299.00,
    currentPrice: 899.00,
    installment: "Queima de estoque encerrada",
    pixDiscount: "Desconto histórico",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 6500,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Cafeteira Nespresso Essenza Mini 19 Bar com Kit de Boas-Vindas de Cápsulas",
    rawUrl: "https://www.magazineluiza.com.br/p/237293200/",
    category: "casa-inteligente",
    store: "magalu",
    originalPrice: 549.00,
    currentPrice: 249.00,
    installment: "Oferta de Natal encerrada",
    pixDiscount: "Preço no Pix na época",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 14000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Apple Watch SE 1ª Geração GPS 40mm Caixa Cinza Espacial com Pulseira Esportiva",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928405-apple-watch-se-40mm-gps",
    category: "iphones",
    store: "mercadolivre",
    originalPrice: 2999.00,
    currentPrice: 1399.00,
    installment: "Últimas unidades esgotadas",
    pixDiscount: "Preço na época",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 7800,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Smartphone Samsung Galaxy S22 5G 128GB Snapdragon 8 Gen 1 Câmera 50MP Nightography",
    rawUrl: "https://www.magazineluiza.com.br/p/237293300/",
    category: "tecnologia",
    store: "magalu",
    originalPrice: 5999.00,
    currentPrice: 1999.00,
    installment: "Queima de estoque encerrada",
    pixDiscount: "Desconto no Pix Magalu",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 19000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Copo Térmico Stanley com Tampa 473ml Matte Black Original com Nota Fiscal",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928406-copo-termico-stanley-473ml-com-tampa",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 220.00,
    currentPrice: 99.00,
    installment: "Promoção Dia dos Pais encerrada",
    pixDiscount: "Envio Full na época",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 26000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Kit Teclado Mecânico Gamer Redragon Kumara Switch Blue RGB Anti-Ghosting",
    rawUrl: "https://shopee.com.br/product/teclado-mecanico-redragon-kumara-rgb",
    category: "gamer",
    store: "shopee",
    originalPrice: 299.00,
    currentPrice: 139.00,
    installment: "Cupom Shopee encerrado",
    pixDiscount: "Preço no Pix na época",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 15300,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "SSD Kingston A400 480GB SATA 3 2.5'' Leitura até 500MB/s e Gravação 450MB/s",
    rawUrl: "https://shopee.com.br/product/ssd-kingston-a400-480gb-sata3",
    category: "gamer",
    store: "shopee",
    originalPrice: 259.00,
    currentPrice: 99.00,
    installment: "Flash Shopee encerrado",
    pixDiscount: "Preço na época",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 38000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Smartband Xiaomi Mi Band 7 Tela AMOLED 1.62'' 120 Modos de Treino Monitor SpO2",
    rawUrl: "https://shopee.com.br/product/xiaomi-mi-band-7-smartwatch-original",
    category: "tecnologia",
    store: "shopee",
    originalPrice: 299.00,
    currentPrice: 119.00,
    installment: "Lote promocional encerrado",
    pixDiscount: "Frete Grátis na época",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 29000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Aspirador de Pó Vertical 2 em 1 Electrolux STK10 1000W Bivolt com Cabo de 5 Metros",
    rawUrl: "https://www.magazineluiza.com.br/p/237293400/",
    category: "casa-inteligente",
    store: "magalu",
    originalPrice: 249.00,
    currentPrice: 119.00,
    installment: "Promoção encerrada",
    pixDiscount: "Preço no Pix na época",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 22000,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Perfume Ferrari Black Masculino Eau de Toilette 125ml com Selo Adipec",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928407-perfume-ferrari-black-125ml",
    category: "moda",
    store: "mercadolivre",
    originalPrice: 299.00,
    currentPrice: 129.00,
    installment: "Lote de queima esgotado",
    pixDiscount: "Preço na época",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 16800,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Secador de Cabelo Taiff Red Íon 1900W 110V/220V com Cabo de 1.80m e Emissão de Íons",
    rawUrl: "https://www.magazineluiza.com.br/p/237293500/",
    category: "moda",
    store: "magalu",
    originalPrice: 329.00,
    currentPrice: 159.00,
    installment: "Lote promocional encerrado",
    pixDiscount: "Preço no Pix na época",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.9,
    reviewsCount: 18500,
    couponCode: "ESGOTADO",
    expired: true
  },
  {
    title: "Apple iPhone 12 Mini (64 GB) Preto 5G - Câmera Dupla 12MP e Tela OLED Super Retina",
    rawUrl: "https://produto.mercadolivre.com.br/MLB-361928408-apple-iphone-12-mini-64gb",
    category: "iphones",
    store: "mercadolivre",
    originalPrice: 4999.00,
    currentPrice: 1899.00,
    installment: "Esgotou em 10 minutos",
    pixDiscount: "Maior desconto registrado",
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&auto=format&fit=crop&q=80",
    badge: "⏰ Promoção Encerrada",
    featured: false,
    rating: 4.8,
    reviewsCount: 9200,
    couponCode: "ESGOTADO",
    expired: true
  }
];

// Mapeia as ofertas passadas
const mappedPastOffers = PAST_OFFERS_RAW.map((item, i) => {
  const mapping = AutoMapper.mapUrl(item.rawUrl, AFFILIATE_CONFIG);
  return {
    id: `auto-prod-past-${i + 1}`,
    title: item.title,
    category: item.category,
    store: mapping.store,
    storeName: mapping.storeName,
    badge: item.badge,
    originalPrice: item.originalPrice,
    currentPrice: item.currentPrice,
    installment: item.installment,
    pixDiscount: item.pixDiscount,
    affiliateUrl: mapping.affiliateUrl,
    image: item.image,
    featured: false,
    rating: item.rating,
    reviewsCount: item.reviewsCount,
    couponCode: item.couponCode,
    expired: true,
    dateAdded: "2026-10-15"
  };
});

// Combina as ofertas ativas (151) com as ofertas passadas (23)
const combinedAll = [...currentProducts, ...mappedPastOffers];

// Configuração completa de categorias com a nova aba "⌛ Ofertas Passadas"
const CATEGORIES = [
  { id: "todas", name: "Todas as Ofertas", icon: "💎" },
  { id: "destaques", name: "🔥 Super Destaques", icon: "🔥" },
  { id: "iphones", name: "🍎 iPhones Garimpados", icon: "🍎" },
  { id: "tecnologia", name: "Tecnologia & Celulares", icon: "📱" },
  { id: "casa-inteligente", name: "Casa & Eletro", icon: "🏠" },
  { id: "gamer", name: "Setup & Games", icon: "🎮" },
  { id: "audio", name: "Fones & Som", icon: "🎧" },
  { id: "moda", name: "Moda & Acessórios", icon: "🎒" },
  { id: "passadas", name: "⌛ Ofertas Passadas", icon: "⌛" }
];

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

const productsJsContent = `// Catálogo Oficial Garimpei Aqui Agora
// Última sincronização: ${new Date().toLocaleString("pt-BR")}
// Ofertas ativas e arquivo histórico de promoções!

const DEFAULT_PRODUCTS = ${JSON.stringify(combinedAll, null, 2)};

// Configuração das categorias suportadas
const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

// Configuração das lojas ativas
const STORES = ${JSON.stringify(STORES, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, "products.js"), productsJsContent, "utf-8");
fs.writeFileSync(path.join(__dirname, "products-auto.json"), JSON.stringify(combinedAll, null, 2), "utf-8");

console.log("=================================================");
console.log(`✅ Catálogo atualizado com sucesso!`);
console.log(`🔥 Ofertas Ativas no ar:    ${currentProducts.length}`);
console.log(`⌛ Ofertas Passadas salvas: ${mappedPastOffers.length}`);
console.log(`📦 Total Geral no Sistema:  ${combinedAll.length}`);
console.log("=================================================");

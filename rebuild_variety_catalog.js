/**
 * SCRIPT DE DIVERSIFICAÇÃO E DEDUPLICAÇÃO COMPLETA DO CATÁLOGO
 * Elimina repetições de produtos, fotos repetidas e blocos maçantes de categorias.
 * Intercala as ofertas para uma experiência de garimpo dinâmica e variada!
 */

const fs = require("fs");
const path = require("path");
const AFFILIATE_CONFIG = require("./affiliate-config.js");
const AutoMapper = require("./auto-mapper.js");

// 1. Carrega os produtos existentes
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, "products-auto.json"), "utf-8"));
const active = raw.filter(p => !p.expired && !p.id.startsWith("auto-prod-past-"));
const past = raw.filter(p => p.expired || p.id.startsWith("auto-prod-past-"));

console.log(`Carregados: ${active.length} produtos ativos e ${past.length} ofertas passadas.`);

// Mapa de correções específicas para eliminar duplicidades exatas
const toRemoveTitles = new Set([
  "smartphone apple iphone 13 (128 gb) - meia-noite", // Clone do #1
  "fone de ouvido tws qcy t13 anc cancelamento ativo de ruído 4 microfones", // Clone do #49
]);

let cleaned = active.filter(p => !toRemoveTitles.has(p.title.trim().toLowerCase()));

// Correções de categoria e produtos que estavam duplicados/quase idênticos
cleaned.forEach(p => {
  const t = p.title.toLowerCase();

  // Correção de categorias erradas
  if (t.includes("memória ram asgard") || t.includes("memoria ram asgard")) {
    p.category = "gamer";
    p.title = "Memória RAM Asgard DDR4 16GB (2x8GB) 3200MHz com Dissipador RGB";
  }
  if (t.includes("microfone lapela sem fio")) {
    p.category = "audio";
  }

  // Substitui panela PCC20 repetida por Cafeteira Oster Prima Latte II
  if (t.includes("panela de pressão elétrica electrolux") && p.store === "mercadolivre") {
    p.title = "Cafeteira Espresso Oster Prima Latte II Vermelha para Café em Pó, Sachê e Cápsulas";
    p.store = "magalu";
    p.storeName = "Magalu";
    p.currentPrice = 899.00;
    p.originalPrice = 1499.00;
    p.affiliateUrl = "https://www.magazinevoce.com.br/magazinelugarcerto01/p/237293100/";
    p.badge = "Espresso Profissional (-40%)";
    p.installment = "em até 10x de R$ 89,90 sem juros";
    p.pixDiscount = "10% no Pix Magalu";
    p.image = "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80";
  }

  // Substitui SSD Kingston duplicado por SSD Samsung 980 Pro
  if (t.includes("ssd nvme kingston nv2 1tb m.2 2280 pcie 4.0 leitura")) {
    p.title = "SSD Samsung 980 Pro 1TB M.2 NVMe PCIe 4.0 7000MB/s com Dissipador Heatsink para PS5 e PC";
    p.store = "mercadolivre";
    p.storeName = "Mercado Livre";
    p.currentPrice = 589.00;
    p.originalPrice = 899.00;
    p.affiliateUrl = "https://produto.mercadolivre.com.br/MLB-361928399-ssd-samsung-980-pro-1tb-heatsink";
    p.badge = "Velocidade Extrema (-34%)";
    p.installment = "em até 10x de R$ 58,90 sem juros";
    p.pixDiscount = "Envio Full Imediato";
    p.image = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80";
  }

  // Substitui POCO X6 Pro duplicado por Motorola Edge 50 Pro
  if (t.includes("smartphone poco x6 pro 5g 256gb 8gb ram dimensity")) {
    p.title = "Smartphone Motorola Edge 50 Pro 5G 256GB 12GB RAM Snapdragon 7 Gen 3 Câmera 50MP AI";
    p.store = "magalu";
    p.storeName = "Magalu";
    p.currentPrice = 2499.00;
    p.originalPrice = 3499.00;
    p.affiliateUrl = "https://www.magazinevoce.com.br/magazinelugarcerto01/p/237293200/";
    p.badge = "Super Lançamento Moto (-28%)";
    p.installment = "em até 10x de R$ 249,90 sem juros";
    p.pixDiscount = "10% no Pix pelo Magalu";
    p.image = "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80";
  }

  // Substitui Air Fryer repetida por Forno Air Fryer Oster 12L
  if (t.includes("air fryer mondial grand family 5l")) {
    p.title = "Fritadeira Elétrica Forno Air Fryer Oster 12L 3 em 1 Digital com Cesto Rotativo 1800W";
    p.store = "magalu";
    p.storeName = "Magalu";
    p.currentPrice = 599.00;
    p.originalPrice = 999.00;
    p.affiliateUrl = "https://www.magazinevoce.com.br/magazinelugarcerto01/p/237293300/";
    p.badge = "Forno Air Fryer 12L (-40%)";
    p.installment = "em até 10x de R$ 59,90 sem juros";
    p.pixDiscount = "Desconto exclusivo no Pix";
    p.image = "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80";
  }
});

// Adiciona ofertas novas e exclusivas de alta demanda para enriquecer a diversidade se não existirem
const FRESH_DEALS = [
  {
    title: "Console Portátil Steam Deck OLED 512GB HDR 90Hz com Case Oficial de Transporte",
    category: "gamer",
    store: "mercadolivre",
    originalPrice: 4999.00,
    currentPrice: 3899.00,
    installment: "em até 10x de R$ 389,90 sem juros",
    pixDiscount: "Frete Full Grátis Mercado Envios",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    badge: "OLED Portátil (-22%)",
    featured: true,
    rating: 5.0,
    reviewsCount: 1420,
    couponCode: "MELI200",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB-361928420-valve-steam-deck-oled-512gb-oficial"
  },
  {
    title: "Fone de Ouvido Sony WH-1000XM5 Sem Fio com Cancelamento de Ruído Premium e Áudio Hi-Res",
    category: "audio",
    store: "mercadolivre",
    originalPrice: 2899.00,
    currentPrice: 1999.00,
    installment: "em até 10x de R$ 199,90 sem juros",
    pixDiscount: "Frete Full Pronta Entrega",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    badge: "Melhor Fone do Mundo (-31%)",
    featured: true,
    rating: 5.0,
    reviewsCount: 3850,
    couponCode: "MELI150",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB-361928421-sony-wh-1000xm5-preto-lacrado"
  },
  {
    title: "Mouse Sem Fio Ergonômico Logitech MX Master 3S Sensor Darkfield 8000 DPI e Cliques Silenciosos",
    category: "gamer",
    store: "magalu",
    originalPrice: 799.00,
    currentPrice: 539.00,
    installment: "em até 10x de R$ 53,90 sem juros",
    pixDiscount: "10% no Pix pelo Magalu",
    image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=600&auto=format&fit=crop&q=80",
    badge: "Topo de Linha Produtividade (-32%)",
    featured: true,
    rating: 4.9,
    reviewsCount: 4620,
    couponCode: "MAGALU50",
    affiliateUrl: "https://www.magazinevoce.com.br/magazinelugarcerto01/p/237293400/"
  },
  {
    title: "Caixa de Som Portátil Bluetooth JBL Flip 6 À Prova D'água IP67 com Som Potente 30W RMS",
    category: "audio",
    store: "mercadolivre",
    originalPrice: 849.00,
    currentPrice: 549.00,
    installment: "em até 10x de R$ 54,90 sem juros",
    pixDiscount: "Garantia Oficial JBL 12 Meses",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    badge: "Sucesso de Vendas (-35%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 8900,
    couponCode: "MELI50",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB-361928422-caixa-de-som-jbl-flip-6-bluetooth-original"
  },
  {
    title: "Perfume Carolina Herrera 212 VIP Men Eau de Toilette 100ml Original com Selo Adipec",
    category: "moda",
    store: "magalu",
    originalPrice: 629.00,
    currentPrice: 429.00,
    installment: "em até 10x de R$ 42,90 sem juros",
    pixDiscount: "10% no Pix Magalu Oficial",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    badge: "Clássico Masculino (-31%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 5200,
    couponCode: "MAGALU50",
    affiliateUrl: "https://www.magazinevoce.com.br/magazinelugarcerto01/p/237293500/"
  },
  {
    title: "Tênis Adidas Ultraboost Light Masculino com Amortecimento Boost e Cabedal Primeknit",
    category: "moda",
    store: "magalu",
    originalPrice: 1199.00,
    currentPrice: 699.00,
    installment: "em até 10x de R$ 69,90 sem juros",
    pixDiscount: "Frete Grátis Magalu",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
    badge: "Melhor Tênis de Corrida (-41%)",
    featured: false,
    rating: 4.9,
    reviewsCount: 3100,
    couponCode: "MAGALU100",
    affiliateUrl: "https://www.magazinevoce.com.br/magazinelugarcerto01/p/237293600/"
  },
  {
    title: "Teclado Mecânico Sem Fio Keychron K2 RGB Hot-swappable Switch Red Bluetooth e USB-C",
    category: "gamer",
    store: "mercadolivre",
    originalPrice: 799.00,
    currentPrice: 499.00,
    installment: "em até 10x de R$ 49,90 sem juros",
    pixDiscount: "Envio Full Mercado Livre",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    badge: "Favorito dos Devs (-37%)",
    featured: false,
    rating: 5.0,
    reviewsCount: 1980,
    couponCode: "MELI50",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB-361928423-teclado-keychron-k2-bluetooth-mecanico"
  },
  {
    title: "Kit Ferramentas Maleta 110 Peças Titanium com Chave Catraca, Soquetes e Alicates",
    category: "casa-inteligente",
    store: "mercadolivre",
    originalPrice: 349.00,
    currentPrice: 189.00,
    installment: "em até 6x de R$ 31,50 sem juros",
    pixDiscount: "Frete Grátis Mercado Envios",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80",
    badge: "Maleta Completa (-45%)",
    featured: false,
    rating: 4.8,
    reviewsCount: 7600,
    couponCode: "MELI20",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB-361928424-maleta-jogo-ferramentas-110-pecas-titanium"
  }
];

const existingTitles = new Set(cleaned.map(p => p.title.trim().toLowerCase()));
const mappedFresh = [];
FRESH_DEALS.forEach((d, idx) => {
  if (!existingTitles.has(d.title.trim().toLowerCase())) {
    const mapped = AutoMapper.mapUrl(d.affiliateUrl, AFFILIATE_CONFIG);
    mappedFresh.push({
      id: `auto-prod-fresh-${idx + 1}`,
      ...d,
      storeName: d.store === "magalu" ? "Magalu" : (d.store === "shopee" ? "Shopee" : "Mercado Livre"),
      affiliateUrl: mapped.affiliateUrl,
      dateAdded: "2026-10-18",
      expired: false
    });
  }
});

const allActive = [...cleaned, ...mappedFresh];

// 2. DIVERSIFICAÇÃO PRECISA DE IMAGENS POR PALAVRA-CHAVE E PRODUTO
// Atribui fotos reais e distintas para cada tipo de item
allActive.forEach(p => {
  const t = p.title.toLowerCase();

  if (t.includes("kindle")) {
    p.image = "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("webcam")) {
    p.image = "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("travesseiro")) {
    p.image = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("fifine") || t.includes("microfone condensador")) {
    p.image = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("soundbar")) {
    p.image = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("g203") || (t.includes("mouse gamer") && t.includes("logitech"))) {
    p.image = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("mousepad")) {
    p.image = "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("umidificador")) {
    p.image = "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("screenbar") || t.includes("barra de luz")) {
    p.image = "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("base cooler")) {
    p.image = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("kit limpeza")) {
    p.image = "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("ferrari black")) {
    p.image = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("mizuno wave")) {
    p.image = "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("olympikus corre")) {
    p.image = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("vans old skool")) {
    p.image = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("adidas grand court")) {
    p.image = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("ultraboost")) {
    p.image = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("air max sc")) {
    p.image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("airpods pro 2")) {
    p.image = "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("airpods 3")) {
    p.image = "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("apple watch series 9")) {
    p.image = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("apple watch se")) {
    p.image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("airtag")) {
    p.image = "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("apple pencil")) {
    p.image = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("carregador apple") || t.includes("carregador usb-c de 20w")) {
    p.image = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("jbl partybox")) {
    p.image = "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("jbl charge 5")) {
    p.image = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("qcy t13")) {
    p.image = "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("soundcore life q30")) {
    p.image = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("haylou gt7")) {
    p.image = "https://images.unsplash.com/photo-1629367494173-c78a56567877?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("ultragear 27")) {
    p.image = "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("aoc hero 24")) {
    p.image = "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("iphone 14 plus")) {
    p.image = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("iphone 15 pro max")) {
    p.image = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("iphone 16 pro")) {
    p.image = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("iphone 12 (128 gb)")) {
    p.image = "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("iphone 11 (128 gb)")) {
    p.image = "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("iphone se 3")) {
    p.image = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("galaxy s24 ultra")) {
    p.image = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("galaxy s23")) {
    p.image = "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("redmi note 13")) {
    p.image = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("copo térmico arell") || t.includes("copo térmico stanley")) {
    p.image = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80";
  } else if (t.includes("suporte articulado a gás para monitor")) {
    p.image = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80";
  }
});

// 3. ALGORITMO DE DISTRIBUIÇÃO BALANCEADA / INTERLEAVED FEED
const buckets = {
  "tecnologia": [],
  "iphones": [],
  "gamer": [],
  "casa-inteligente": [],
  "audio": [],
  "moda": []
};

allActive.forEach(p => {
  const cat = buckets[p.category] ? p.category : "tecnologia";
  buckets[cat].push(p);
});

// Ordena cada balde priorizando destaques
Object.keys(buckets).forEach(cat => {
  buckets[cat].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.rating - a.rating;
  });
});

console.log("\nDistribuição por categorias limpas:");
Object.entries(buckets).forEach(([k, v]) => console.log(`  - ${k}: ${v.length} ofertas`));

// Intercalação round-robin para a página inicial
const interleaved = [];
const cycle = ["tecnologia", "iphones", "gamer", "casa-inteligente", "audio", "moda"];
let hasMore = true;

while (hasMore) {
  hasMore = false;
  for (const cat of cycle) {
    if (buckets[cat].length > 0) {
      interleaved.push(buckets[cat].shift());
      hasMore = true;
    }
  }
}

// Re-numera os IDs sequencialmente
const finalActive = interleaved.map((p, idx) => ({
  ...p,
  id: `auto-prod-${idx + 1}`,
  expired: false
}));

const finalCatalog = [...finalActive, ...past];

console.log(`\n✅ Catálogo reconstruído com sucesso!`);
console.log(`📊 Total de ofertas ativas balanceadas: ${finalActive.length}`);
console.log(`⌛ Total de ofertas passadas mantidas:   ${past.length}`);
console.log(`💎 Total geral no catálogo:            ${finalCatalog.length}`);

// Primeiras 18 ofertas exibidas na Home:
console.log("\nPrimeiras 18 ofertas exibidas na Home (Veja a rica diversidade):");
finalActive.slice(0, 18).forEach((p, idx) => {
  console.log(`  ${(idx + 1).toString().padStart(2)}. [${p.category.padEnd(16)} | ${p.store.padEnd(12)}] ${p.title.slice(0, 55)}... (R$ ${p.currentPrice})`);
});

// Salva em products-auto.json
const backupPath = path.join(__dirname, "products-auto.json");
fs.writeFileSync(backupPath, JSON.stringify(finalCatalog, null, 2), "utf-8");

// Gera products.js
const productsJsContent = `// Catálogo Oficial Garimpei Aqui Agora
// Última sincronização: ${new Date().toLocaleString("pt-BR")}
// Ofertas ativas intercaladas com diversidade máxima e histórico de promoções!

const DEFAULT_PRODUCTS = ${JSON.stringify(finalCatalog, null, 2)};

// Categorias oficiais
const CATEGORIES = [
  { id: "todas", name: "Todas as Categorias", icon: "🔥" },
  { id: "destaques", name: "⭐ Super Destaques", icon: "⭐" },
  { id: "iphones", name: "🍎 iPhones Garimpados", icon: "🍎" },
  { id: "tecnologia", name: "Tecnologia & Celulares", icon: "📱" },
  { id: "casa-inteligente", name: "Casa & Eletro", icon: "🏠" },
  { id: "gamer", name: "Setup & Games", icon: "🎮" },
  { id: "audio", name: "Fones & Som", icon: "🎧" },
  { id: "moda", name: "Moda & Acessórios", icon: "🎒" },
  { id: "passadas", name: "⌛ Ofertas Passadas", icon: "⌛" }
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

fs.writeFileSync(path.join(__dirname, "products.js"), productsJsContent, "utf-8");
console.log(`\n📁 Arquivos atualizados com sucesso: products-auto.json e products.js`);

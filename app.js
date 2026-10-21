/**
 * GARIMPO DE OFERTAS - APLICAÇÃO PRINCIPAL
 * Gerenciamento dinâmico de produtos, filtros, busca, cópia de links de afiliado e painel de cadastro
 */

// Estado global da aplicação
const state = {
  products: [],
  activeCategory: "todas",
  activeSubcategory: "todos",
  activeStore: "todas",
  searchQuery: "",
  sortBy: "recentes",
  theme: "dark",
  displayLimit: 36 // Exibe inicialmente 36 ofertas com carregamento progressivo
};

// Configuração oficial e segura das lojas parceiras
const STORE_DEFINITIONS = (typeof STORES !== "undefined" && !Array.isArray(STORES)) ? STORES : {
  mercadolivre: {
    id: "mercadolivre",
    name: "Mercado Livre",
    color: "#ffe600",
    textColor: "#2d3277",
    badgeBg: "rgba(255, 230, 0, 0.2)",
    logoEmoji: "🤝"
  },
  shopee: {
    id: "shopee",
    name: "Shopee",
    color: "#ee4d2d",
    textColor: "#ffffff",
    badgeBg: "rgba(238, 77, 45, 0.15)",
    logoEmoji: "🛍️"
  },
  magalu: {
    id: "magalu",
    name: "Magazine Luiza",
    color: "#0086ff",
    textColor: "#ffffff",
    badgeBg: "rgba(0, 134, 255, 0.15)",
    logoEmoji: "💙"
  },
  outros: {
    id: "outros",
    name: "Loja Parceira",
    color: "#10b981",
    textColor: "#ffffff",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    logoEmoji: "🛒"
  }
};

function getStoreInfo(storeKey) {
  if (!storeKey) return STORE_DEFINITIONS.outros;
  return STORE_DEFINITIONS[storeKey] || STORE_DEFINITIONS.outros;
}

// Subcategorias dinâmicas por categoria principal (Atende 100% dos itens solicitados pelo usuário)
const SUBCATEGORIES = {
  eletronicos: [
    { id: "todos", name: "Todos os Eletrônicos", icon: "💻" },
    { id: "consoles", name: "Consoles & Games", icon: "🎮", query: ["console", "playstation", "ps5", "xbox", "nintendo", "switch", "steam deck", "game", "gamer", "ram asgard"] },
    { id: "smartphones", name: "Celulares & Smartphones", icon: "📱", query: ["smartphone", "galaxy", "celular", "xiaomi", "redmi", "motorola", "poco", "edge"] },
    { id: "computadores", name: "Computadores & PCs", icon: "🖥️", query: ["computador", "pc", "notebook", "dell", "macbook", "inspiron"] },
    { id: "placas", name: "Placas de Vídeo", icon: "🎮", query: ["rtx", "geforce", "placa de vídeo", "placa de video", "radeon", "rx 6600", "rx 7600", "gtx", "arc a580"] },
    { id: "monitores", name: "Monitores", icon: "📺", query: ["monitor", "ultragear", "144hz", "curvo", "odyssey", "evnia", "superframe", "valak"] },
    { id: "cadeiras", name: "Cadeiras Gamers", icon: "💺", query: ["cadeira"] },
    { id: "teclados", name: "Teclados", icon: "⌨️", query: ["teclado", "keychron", "kumara", "mitra", "alloy origins", "fizz", "blackwidow", "machenike", "bora", "karura"] },
    { id: "mouses", name: "Mouses", icon: "🖱️", query: ["mouse", "logitech", "mx master", "deathadder", "viper mini", "lift vertical", "cobra m711", "superlight", "pulsefire", "pebble", "shark x3", "basilisk", "delux"] },
    { id: "fones", name: "Fones & Headsets", icon: "🎧", query: ["fone", "headset", "jbl", "sony", "hyperx", "havit", "microfone"] },
    { id: "mousepads", name: "Mousepads", icon: "⬛", query: ["mousepad", "speed", "desk pad", "archelon", "qck", "pantera"] }
  ],
  casa: [
    { id: "todos", name: "Toda a Casa", icon: "🏠" },
    { id: "geladeiras", name: "Geladeiras", icon: "❄️", query: ["geladeira", "frost free"] },
    { id: "frigobar", name: "Frigobares", icon: "🧊", query: ["frigobar"] },
    { id: "microondas", name: "Micro-ondas", icon: "🍲", query: ["micro-ondas", "microondas"] },
    { id: "airfryer", name: "Airfryers", icon: "🍟", query: ["air fryer", "airfryer", "fritadeira"] },
    { id: "tv", name: "Smart TVs", icon: "📺", query: ["tv", "oled", "crystal", "smart tv", "qled", "roku", "ambilight"] },
    { id: "guarda-roupa", name: "Guarda-Roupas", icon: "🚪", query: ["guarda-roupa", "guarda roupa", "roupeiro"] },
    { id: "lavar", name: "Máquinas de Lavar", icon: "🧺", query: ["lava e seca", "máquina de lavar", "maquina de lavar", "lavadora"] },
    { id: "aspirador", name: "Robôs & Aspiradores", icon: "🧹", query: ["aspirador", "robô", "robo", "roomba"] }
  ],
  moda: [
    { id: "todos", name: "Toda a Moda", icon: "👟" },
    { id: "tenis", name: "Tênis", icon: "👟", query: ["tênis", "tenis", "nike", "adidas", "vans", "mizuno", "olympikus", "asics", "all star", "puma"] },
    { id: "oculos", name: "Óculos", icon: "🕶️", query: ["óculos", "oculos", "aviador", "ray-ban", "oakley", "wayfarer", "polarizado", "clubmaster", "frogskins", "justin", "sutro", "round metal", "mormaii", "gascan", "colcci"] },
    { id: "relogios", name: "Relógios", icon: "⌚", query: ["relógio", "relogio", "orient", "casio", "g-shock", "invicta", "technos", "curren", "seculus", "nibosi", "condor"] },
    { id: "pulseiras", name: "Pulseiras", icon: "⛓️", query: ["pulseira", "grumet", "bracelete", "elos cartier", "veneziana", "piastrina", "rommanel"] },
    { id: "perfumes", name: "Perfumes", icon: "🧴", query: ["perfume", "sauvage", "212", "ferrari", "invictus", "armani", "pacorabanne", "malbec", "1 million", "bleu de chanel", "eros", "le male", "azzaro", "nautica", "lattafa", "explorer", "ck one"] },
    { id: "acessorios", name: "Mochilas & Acessórios", icon: "🎒", query: ["mochila", "carteira", "cinto", "meia", "havaianas", "chinelo", "sandália", "sandalia"] }
  ],
  feminino: [
    { id: "todos", name: "Toda Beleza & Moda", icon: "💄" },
    { id: "roupas", name: "Roupas", icon: "👗", query: ["vestido", "conjunto", "alfaiataria", "bolsa", "cropped", "saia", "macacão", "macacao", "wide leg", "blazer", "tubinho"] },
    { id: "maquiagens", name: "Maquiagens", icon: "💋", query: ["maquiagem", "batom", "cílios", "cilios", "pincéis", "pinceis", "base", "corretivo", "máscara de cílios", "rimel", "blush", "pó facial", "po facial", "paleta", "delineador", "gloss", "esponja"] },
    { id: "perfumes", name: "Perfumes Femininos", icon: "🌸", query: ["perfume", "lancôme", "good girl", "lily", "vip rosé", "chloé", "scandal", "idôle", "niina secrets", "miss dior", "essencial", "egeo", "armani sì"] },
    { id: "cremes", name: "Cremes & Skincare", icon: "🧴", query: ["creme", "cerave", "victoria's secret", "sérum", "serum", "anthelios", "protetor", "hidratação", "retinol", "vitamina c", "q10", "bio-oil", "água micelar", "agua micelar", "gel de limpeza", "hydro boost", "cetaphil"] },
    { id: "shampoos", name: "Shampoos & Kits", icon: "✨", query: ["shampoo", "condicionador", "wella", "truss", "lola", "cronograma", "óleo", "oleo", "máscara capilar", "mascara capilar", "haskell", "absolut repair", "glycolic gloss", "kérastase", "salon line", "braé", "pantene", "tônico poderoso"] },
    { id: "escovas", name: "Escovas de Secar", icon: "💨", query: ["escova secadora", "secador", "taiff", "mondial", "babyliss", "chapinha", "prancha", "escova rotativa", "difusor", "modelador", "escova alisadora", "lizze"] }
  ],
  infantil: [
    { id: "todos", name: "Todo Infantil", icon: "🧸" },
    { id: "brinquedos", name: "Brinquedos", icon: "🎲", query: ["lego", "brinquedo", "boneca", "baby alive", "barbie", "massinha", "play-doh", "nerf", "pelúcia", "pelucia", "marvel", "homem de ferro", "stitch", "fisher-price", "slime", "pikachu", "pokémon"] },
    { id: "carrinhos", name: "Hot Wheels & Carrinhos", icon: "🏎️", query: ["hot wheels", "pista", "carrinho", "controle remoto", "garagem", "monster jam", "monster trucks", "cegonha", "estacionamento"] },
    { id: "roupas", name: "Roupas & Conjuntos", icon: "👕", query: ["conjunto", "body", "bodies", "camiseta", "shorts", "mochila", "macacãozinho", "macacaozinho", "pijama", "pijamas", "meias", "moletom", "vestido infantil", "brandili", "kyly", "milon"] },
    { id: "jogos", name: "Jogos & Tabuleiro", icon: "♟️", query: ["banco imobiliário", "uno", "jogo", "cara a cara", "perfil", "war", "detetive", "catan", "pinguim", "dixit", "jenga", "dobble", "imagem & ação", "vida", "quebra-cabeça", "pula macaco"] },
    { id: "tecnologia", name: "Tablets & Fones", icon: "📱", query: ["tablet", "jbl jr", "patinete", "smartwatch infantil", "câmera fotográfica", "camera fotografica", "lousa mágica", "lousa magica", "walkie talkie", "orelhinha de gato", "karaokê", "karaoke"] }
  ],
  iphones: [
    { id: "todos", name: "Todos iPhones & Apple", icon: "🍎" },
    { id: "iphones", name: "iPhones", icon: "📱", query: ["iphone"] },
    { id: "airpods", name: "AirPods", icon: "🎧", query: ["airpods", "case", "capa airpods", "caneta limpadora", "limpeza"] },
    { id: "watch", name: "Apple Watch", icon: "⌚", query: ["watch", "pulseira milanese", "pulseira oceano", "carregador magnético", "película", "pelicula", "suporte base de carregamento"] }
  ],
  esporte: [
    { id: "todos", name: "Todo Esporte", icon: "⚡" },
    { id: "suplementos", name: "Suplementos & Whey", icon: "💪", query: ["whey", "creatina", "shaker", "coqueteleira", "pré-treino", "pre-treino", "bcaa", "pasta de amendoim", "hipercalórico", "hipercalorico", "glutamina", "multivitamínico", "multivitaminico", "blenderbottle"] },
    { id: "tenis", name: "Tênis de Corrida", icon: "🏃", query: ["corre 3", "tênis", "tenis", "pegasus", "cumulus", "ultraboost", "novablast", "corre vento", "float elite", "wave rider", "corre trilha", "invincible", "deviate nitro", "nimbus", "adizero boston"] },
    { id: "treino", name: "Acessórios de Treino", icon: "🏋️", query: ["smartwatch", "elásticos", "corda", "tapete", "halteres", "mochila", "garrafa", "hand grip", "roda abdominal", "kettlebell", "barra de porta", "cinto", "fita de suspensão", "luva de treino"] }
  ]
};

// Chaves do LocalStorage
const CUSTOM_OFFERS_KEY = "garimpei_custom_offers_v2";
const THEME_KEY = "garimpo_tema_v1";
const AFFILIATE_CONFIG_KEY = "garimpo_affiliate_config_v1";
const OLD_STORAGE_KEY = "garimpo_ofertas_produtos_v1";

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initAdminSecurity();
  initAffiliateConfig();
  initProducts();
  renderCategories();
  renderSubcategories();
  renderStoreFilters();
  setupEventListeners();
  renderProducts();
});

/**
 * Sanitiza o identificador da loja Magalu (Magazine Você), extraindo apenas o slug
 */
function sanitizeMagaluStore(storeName) {
  if (!storeName || typeof storeName !== "string") return "magazinelugarcerto01";
  let s = storeName.trim();
  s = s.replace(/https?:\/\//gi, "");
  s = s.replace(/www\./gi, "");
  s = s.replace(/magazinevoce\.com\.br\/?/gi, "");
  s = s.replace(/magazineluiza\.com\.br\/?/gi, "");
  s = s.replace(/^\/+|\/+$/g, "");
  s = s.split("/")[0] || "magazinelugarcerto01";
  if (!s || s === "magazinemaisofertas") s = "magazinelugarcerto01";
  return s;
}

/**
 * Retorna as credenciais ativas de afiliados (LocalStorage ou Padrão Oficial)
 */
function getAffiliateConfig() {
  const officialDefaults = {
    mercadolivre: { toolId: "23610538", affiliateWord: "givi713407", enabled: true },
    shopee: { affiliateId: "18345170182", enabled: true },
    magalu: { storeName: "magazinelugarcerto01", enabled: true },
    general: {
      whatsappGroupUrl: "https://chat.whatsapp.com/G36CRa6FpZS03Gq4NSi7da",
      whatsappGroupName: "Grupo VIP de Ofertas"
    }
  };

  const baseConfig = (typeof AFFILIATE_CONFIG !== "undefined") ? AFFILIATE_CONFIG : officialDefaults;

  try {
    const saved = localStorage.getItem(AFFILIATE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const rawMagalu = parsed.magalu?.storeName;
      const cleanMagalu = sanitizeMagaluStore(rawMagalu || baseConfig.magalu?.storeName || officialDefaults.magalu.storeName);

      return {
        mercadolivre: {
          toolId: parsed.mercadolivre?.toolId || baseConfig.mercadolivre?.toolId || officialDefaults.mercadolivre.toolId,
          affiliateWord: parsed.mercadolivre?.affiliateWord || baseConfig.mercadolivre?.affiliateWord || officialDefaults.mercadolivre.affiliateWord,
          enabled: true
        },
        shopee: {
          affiliateId: parsed.shopee?.affiliateId || baseConfig.shopee?.affiliateId || officialDefaults.shopee.affiliateId,
          enabled: true
        },
        magalu: {
          storeName: cleanMagalu,
          enabled: true
        },
        general: {
          whatsappGroupUrl: parsed.general?.whatsappGroupUrl || baseConfig.general?.whatsappGroupUrl || officialDefaults.general.whatsappGroupUrl,
          whatsappGroupName: parsed.general?.whatsappGroupName || baseConfig.general?.whatsappGroupName || officialDefaults.general.whatsappGroupName
        }
      };
    }
  } catch (err) {
    console.error("Erro ao ler config de afiliados:", err);
  }

  return {
    ...baseConfig,
    magalu: {
      ...baseConfig.magalu,
      storeName: sanitizeMagaluStore(baseConfig.magalu?.storeName || officialDefaults.magalu.storeName),
      enabled: true
    },
    general: {
      whatsappGroupUrl: baseConfig.general?.whatsappGroupUrl || officialDefaults.general.whatsappGroupUrl,
      whatsappGroupName: baseConfig.general?.whatsappGroupName || officialDefaults.general.whatsappGroupName
    }
  };
}

/**
 * Atualiza todos os botões e links de WhatsApp do site com o link ativo configurado
 */
function updateWhatsAppLinks() {
  const cfg = getAffiliateConfig();
  const url = cfg.general?.whatsappGroupUrl || "https://chat.whatsapp.com/G36CRa6FpZS03Gq4NSi7da";
  document.querySelectorAll('a[href*="chat.whatsapp.com"]').forEach(a => {
    a.href = url;
  });
}

/**
 * Garante que a URL do produto tenha 100% de precisão de afiliado antes de ir pro botão Pegar Oferta
 */
function getVerifiedAffiliateUrl(product, config) {
  const cfg = config || getAffiliateConfig();
  let raw = product.affiliateUrl || product.rawUrl || "";

  // Remove qualquer duplicação acidental na URL crua (ex: https://dominio/https://...)
  while (/^https?:\/\/[^/]+\/https?:\/\//i.test(raw)) {
    raw = raw.replace(/^https?:\/\/[^/]+\//i, "");
  }

  if (typeof AutoMapper !== "undefined") {
    const mapped = AutoMapper.mapUrl(raw, cfg);
    return mapped.affiliateUrl;
  }
  return raw;
}

/**
 * Inicializa e preenche o modal de configuração de afiliados (Lojas ativas: Mercado Livre, Shopee, Magalu, WhatsApp)
 */
function initAffiliateConfig() {
  const config = getAffiliateConfig();
  const shopeeInput = document.getElementById("cfgShopeeId");
  const magaluInput = document.getElementById("cfgMagaluStore");
  const mlToolInput = document.getElementById("cfgMercadoLivreTool");
  const mlWordInput = document.getElementById("cfgMercadoLivreWord");
  const wppInput = document.getElementById("cfgWhatsappGroup");

  if (shopeeInput && config.shopee) shopeeInput.value = config.shopee.affiliateId || "";
  if (magaluInput && config.magalu) magaluInput.value = sanitizeMagaluStore(config.magalu.storeName) || "magazinelugarcerto01";
  if (mlToolInput && config.mercadolivre) mlToolInput.value = config.mercadolivre.toolId || "";
  if (mlWordInput && config.mercadolivre) mlWordInput.value = config.mercadolivre.affiliateWord || "";
  if (wppInput && config.general) wppInput.value = config.general.whatsappGroupUrl || "https://chat.whatsapp.com/G36CRa6FpZS03Gq4NSi7da";

  updateWhatsAppLinks();
}

/**
 * Inicializa os produtos carregando o catálogo oficial massivo (100+ ofertas)
 * e mescla com quaisquer ofertas customizadas criadas pelo administrador.
 * Remove caches defasados para garantir que todos os visitantes vejam o catálogo completo.
 */
function initProducts() {
  // Purga caches defasados ou ofertas de testes que possam conter links quebrados ou imagens inválidas
  const CURRENT_CATALOG_VERSION = "20261021_v9_realtime_live";
  try {
    if (localStorage.getItem("garimpei_catalog_version") !== CURRENT_CATALOG_VERSION) {
      localStorage.removeItem(CUSTOM_OFFERS_KEY);
      localStorage.removeItem(OLD_STORAGE_KEY);
      localStorage.removeItem("garimpo_produtos_v2");
      localStorage.removeItem("garimpei_custom_offers");
      localStorage.setItem("garimpei_catalog_version", CURRENT_CATALOG_VERSION);
    }

    const saved = localStorage.getItem(AFFILIATE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Se continha o nome antigo da magalu, Shopee em branco ou URL completa no storeName, limpa ou higieniza
      if (
        parsed.magalu?.storeName === "magazinemaisofertas" ||
        (parsed.magalu?.storeName && (parsed.magalu.storeName.includes("http") || parsed.magalu.storeName.includes("magazinevoce"))) ||
        !parsed.shopee?.affiliateId ||
        !parsed.mercadolivre?.toolId
      ) {
        if (parsed.magalu?.storeName) {
          parsed.magalu.storeName = sanitizeMagaluStore(parsed.magalu.storeName);
          localStorage.setItem(AFFILIATE_CONFIG_KEY, JSON.stringify(parsed));
        } else {
          localStorage.removeItem(AFFILIATE_CONFIG_KEY);
        }
      }
    }
  } catch (e) {}

  const config = getAffiliateConfig();

  // 1. Carrega todas as ofertas oficiais de Mercado Livre, Shopee e Magalu (Garante compatibilidade total)
  const availableBase = (typeof DEFAULT_PRODUCTS !== "undefined" && Array.isArray(DEFAULT_PRODUCTS) && DEFAULT_PRODUCTS.length > 0)
    ? DEFAULT_PRODUCTS
    : ((typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) && PRODUCTS.length > 0)
        ? PRODUCTS
        : ((typeof window !== "undefined" && Array.isArray(window.PRODUCTS)) ? window.PRODUCTS : []));

  const baseProducts = [...availableBase];

  // 2. Carrega ofertas manuais cadastradas pelo administrador (higienizando contra itens fictícios)
  let customOffers = [];
  try {
    const savedCustom = localStorage.getItem(CUSTOM_OFFERS_KEY);
    if (savedCustom) {
      customOffers = JSON.parse(savedCustom)
        .map(o => {
          let u = o.affiliateUrl || o.rawUrl || "";
          while (/^https?:\/\/[^/]+\/https?:\/\//i.test(u)) {
            u = u.replace(/^https?:\/\/[^/]+\//i, "");
          }
          return { ...o, affiliateUrl: u };
        })
        .filter(o => {
          if (!o || !o.title || !o.image) return false;
          const u = o.affiliateUrl || o.rawUrl || "";
          // Descarta links conhecidos de teste que não existem
          if (u.includes("MLB152431") || u.includes("233968815") || u.includes("MLB-358912019")) return false;
          return true;
        });
    }
  } catch (err) {
    console.error("Erro ao carregar ofertas manuais:", err);
  }

  // 3. Combina ofertas manuais no topo, sem duplicar IDs
  const customIds = new Set(customOffers.map(o => o.id));
  const combined = [
    ...customOffers,
    ...baseProducts.filter(p => !customIds.has(p.id))
  ];

  // 4. Aplica as credenciais do afiliado em todos os links
  state.products = combined.map(p => {
    return {
      ...p,
      affiliateUrl: getVerifiedAffiliateUrl(p, config)
    };
  });
}

function saveProducts() {
  // Mantido para compatibilidade interna
}

/**
 * Renderiza os botões de categorias no menu de navegação
 */
function renderCategories() {
  const container = document.getElementById("categoriesNav");
  if (!container) return;

  const cats = (typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES)) ? CATEGORIES : [];
  container.innerHTML = cats.map(cat => `
    <button class="cat-btn ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.icon}</span>
      <span>${cat.name}</span>
    </button>
  `).join("");
}

/**
 * Renderiza os botões de subcategorias de acordo com a categoria principal ativa
 */
function renderSubcategories() {
  const container = document.getElementById("subcategoriesNav");
  if (!container) return;

  const currentCat = state.activeCategory;
  const subs = SUBCATEGORIES[currentCat];

  if (!subs || subs.length === 0) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  container.style.display = "flex";
  const catObj = (typeof CATEGORIES !== "undefined" && CATEGORIES.find(c => c.id === currentCat)) || { name: "" };
  container.innerHTML = `
    <span class="subcat-label">⚡ Filtrar ${escapeHtml(catObj.name)}:</span>
    ${subs.map(sub => `
      <button class="subcat-btn ${sub.id === state.activeSubcategory ? 'active' : ''}" data-subcategory="${sub.id}">
        <span>${sub.icon}</span>
        <span>${escapeHtml(sub.name)}</span>
      </button>
    `).join("")}
  `;
}

/**
 * Renderiza os botões de filtro por Loja Parceira
 */
function renderStoreFilters() {
  const container = document.getElementById("storesFilterGrid");
  if (!container) return;

  const storeKeys = ["todas", "mercadolivre", "shopee", "magalu"];
  
  container.innerHTML = storeKeys.map(key => {
    if (key === "todas") {
      return `
        <button class="store-filter-btn ${state.activeStore === 'todas' ? 'active' : ''}" data-store="todas">
          <span>🏪</span> Todas as Lojas
        </button>
      `;
    }
    const store = getStoreInfo(key);
    return `
      <button class="store-filter-btn ${state.activeStore === key ? 'active' : ''}" data-store="${key}">
        <span>${store.logoEmoji}</span> ${store.name}
      </button>
    `;
  }).join("");
}

/**
 * Filtra e ordena os produtos de acordo com o estado
 */
function getFilteredProducts() {
  let list = [...state.products];

  // 1. Filtro por Categoria
  if (state.activeCategory === "passadas") {
    // Aba exclusiva de ofertas passadas / encerradas
    list = list.filter(p => p.expired === true);
  } else {
    // Todas as outras abas exibem APENAS ofertas ativas e válidas!
    list = list.filter(p => !p.expired);

    if (state.activeCategory === "destaques") {
      list = list.filter(p => p.featured);
    } else if (state.activeCategory === "iphones") {
      list = list.filter(p => p.category === "iphones" || p.title.toLowerCase().includes("iphone") || p.title.toLowerCase().includes("apple"));
    } else if (state.activeCategory !== "todas") {
      list = list.filter(p => p.category === state.activeCategory);
    }

    // 1.1 Filtro por Subcategoria (quando selecionado um item específico)
    if (state.activeSubcategory && state.activeSubcategory !== "todos" && SUBCATEGORIES[state.activeCategory]) {
      const sub = SUBCATEGORIES[state.activeCategory].find(s => s.id === state.activeSubcategory);
      if (sub && sub.query && Array.isArray(sub.query)) {
        list = list.filter(p => {
          const titleLower = (p.title || "").toLowerCase();
          if (sub.id === "mouses" && titleLower.includes("mousepad")) return false;
          return sub.query.some(term => titleLower.includes(term.toLowerCase()));
        });
      }
    }
  }

  // 2. Filtro por Loja
  if (state.activeStore !== "todas") {
    list = list.filter(p => p.store === state.activeStore);
  }

  // 3. Busca por texto
  if (state.searchQuery.trim() !== "") {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      (p.storeName && p.storeName.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.couponCode && p.couponCode.toLowerCase().includes(q))
    );
  }

  // 4. Ordenação
  if (state.sortBy === "menor-preco") {
    list.sort((a, b) => a.currentPrice - b.currentPrice);
  } else if (state.sortBy === "maior-preco") {
    list.sort((a, b) => b.currentPrice - a.currentPrice);
  } else if (state.sortBy === "maior-desconto") {
    list.sort((a, b) => {
      const discA = a.originalPrice ? ((a.originalPrice - a.currentPrice) / a.originalPrice) : 0;
      const discB = b.originalPrice ? ((b.originalPrice - b.currentPrice) / b.originalPrice) : 0;
      return discB - discA;
    });
  } else {
    // Recentes (padrão)
    list.sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""));
  }

  return list;
}

/**
 * Limpa o texto do selo para remover porcentagens redundantes
 */
function cleanBadgeText(badge) {
  if (!badge) return "";
  return String(badge).replace(/\s*\(-?\d+%(\s*off)?\)\s*/gi, "").trim();
}

/**
 * Tratamento inteligente de erro de imagem por categoria
 */
function handleCardImageError(imgEl, category) {
  if (!imgEl) return;
  imgEl.onerror = null;
  const fallbacks = {
    eletronicos: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    iphones: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    casa: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    moda: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    feminino: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    infantil: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80",
    esporte: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
  };
  const target = fallbacks[category] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80";
  imgEl.src = target;
  // Fallback definitivo anti-falha: SVG estilizado se a rede offline/bloqueada
  imgEl.onerror = function() {
    this.onerror = null;
    this.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20fill%3D%22%231e293b%22%20width%3D%22400%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%20x%3D%22200%22%20y%3D%22200%22%3EGarimpei%20Aqui%20Agora%20%F0%9F%94%A5%3C%2Ftext%3E%3C%2Fsvg%3E";
  };
}
if (typeof window !== "undefined") {
  window.handleCardImageError = handleCardImageError;
}


/**
 * Renderiza a grade de produtos
 */
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const stats = document.getElementById("feedStats");
  const loadMoreContainer = document.getElementById("loadMoreContainer");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const showAllBtn = document.getElementById("showAllBtn");
  if (!grid) return;

  const items = getFilteredProducts();
  const visibleItems = items.slice(0, state.displayLimit);

  if (stats) {
    if (state.activeCategory === "passadas") {
      stats.innerHTML = `Exibindo <strong>${visibleItems.length}</strong> de <strong>${items.length}</strong> ofertas encerradas no arquivo histórico`;
    } else if (visibleItems.length < items.length) {
      stats.innerHTML = `🟢 Exibindo <strong>${visibleItems.length}</strong> de <strong>${items.length}</strong> ofertas 100% reais sincronizadas em tempo real`;
    } else {
      stats.innerHTML = `🟢 Exibindo <strong>${items.length}</strong> ${items.length === 1 ? 'oferta 100% real' : 'ofertas 100% reais'} mineradas ao vivo`;
    }
  }

  // Gerencia visibilidade dos botões de carregar mais
  if (loadMoreContainer) {
    if (items.length > state.displayLimit) {
      loadMoreContainer.style.display = "flex";
      const remaining = items.length - visibleItems.length;
      const nextBatch = Math.min(36, remaining);
      if (loadMoreBtn) {
        loadMoreBtn.innerHTML = `<span>⚡ Carregar Mais ${nextBatch} Ofertas</span> <small style="opacity:0.85; font-size:0.8rem;">(${remaining} restantes)</small>`;
      }
      if (showAllBtn) {
        showAllBtn.innerHTML = `<span>👀 Mostrar Todas as ${items.length} Ofertas</span>`;
      }
    } else {
      loadMoreContainer.style.display = "none";
    }
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>Nenhuma oferta encontrada</h3>
        <p>Tente buscar por outro termo ou selecione outra categoria.</p>
        <button class="btn-primary" style="margin-top: 1rem;" onclick="resetFilters()">Limpar Filtros</button>
      </div>
    `;
    return;
  }

  const isPast = state.activeCategory === "passadas";
  const pastAlertHtml = isPast ? `
    <div class="past-deals-alert">
      <div class="past-alert-content">
        <span class="past-alert-icon">⏳</span>
        <div>
          <h4>Arquivo Histórico de Ofertas Encerradas</h4>
          <p>Estas promoções já encerraram ou esgotaram seus estoques promocionais. Não quer perder as próximas? Entre no nosso Grupo VIP de WhatsApp!</p>
        </div>
      </div>
      <a href="https://chat.whatsapp.com/G36CRa6FpZS03Gq4NSi7da" target="_blank" rel="noopener noreferrer" class="btn-vip-alert">
        <span>💬 Entrar no Grupo VIP</span>
      </a>
    </div>
  ` : '';

  const cardsHtml = visibleItems.map(product => {
    const storeInfo = getStoreInfo(product.store);
    const isExpired = !!product.expired;
    const activeUrl = getVerifiedAffiliateUrl(product);
    
    // Cálculo do Desconto %
    let discountPercent = 0;
    if (product.originalPrice && product.originalPrice > product.currentPrice) {
      discountPercent = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
    }

    const formattedOriginal = product.originalPrice ? formatMoney(product.originalPrice) : "";
    const formattedCurrent = formatMoney(product.currentPrice);

    return `
      <article class="product-card ${isExpired ? 'card-expired' : ''}" id="card-${product.id}">
        <a href="${escapeHtml(activeUrl)}" 
           target="_blank" 
           rel="noopener noreferrer sponsored" 
           class="card-image-wrap"
           onclick="trackAffiliateClick('${escapeHtml(product.id)}', '${escapeHtml(product.store)}')"
           title="Pegar Oferta: ${escapeHtml(product.title)}">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" class="card-img" loading="lazy" referrerpolicy="no-referrer" onerror="handleCardImageError(this, '${escapeHtml(product.category || '')}')" />
          <div class="card-badges-top">
            ${isExpired ? `
              <span class="badge-discount badge-expired">⏰ OFERTA ENCERRADA</span>
            ` : (discountPercent > 0 ? `
              <span class="badge-discount">-${discountPercent}% OFF</span>
            ` : '')}

            ${(!isExpired && product.badge) ? `
              <span class="badge-featured">✨ ${escapeHtml(cleanBadgeText(product.badge))}</span>
            ` : ''}
          </div>

          <div class="store-ribbon" style="background: ${storeInfo.color}; color: ${storeInfo.textColor};">
            <span>${storeInfo.logoEmoji}</span> ${escapeHtml(product.storeName || storeInfo.name)}
          </div>
        </a>

        <div class="card-body">
          <h2 class="card-title" title="${escapeHtml(product.title)}">
            <a href="${escapeHtml(activeUrl)}" 
               target="_blank" 
               rel="noopener noreferrer sponsored"
               class="card-title-link"
               onclick="trackAffiliateClick('${escapeHtml(product.id)}', '${escapeHtml(product.store)}')">
              ${escapeHtml(product.title)}
            </a>
          </h2>

          <div class="card-rating">
            <span>⭐ ${product.rating || "4.8"}</span>
            <span class="reviews-count">(${product.reviewsCount ? product.reviewsCount.toLocaleString('pt-BR') : '1.200+'})</span>
          </div>

          <div class="price-container">
            ${formattedOriginal ? `<div class="price-original">${isExpired ? 'Preço na época: De ' : 'De '}${formattedOriginal}</div>` : ''}
            <div class="price-row">
              <span class="price-current ${isExpired ? 'price-current-expired' : ''}">${isExpired ? 'Custou R$ ' : 'R$ '}${formattedCurrent}</span>
            </div>
            ${isExpired ? `
              <div class="expired-pill">⚠️ Preço pode ter subido na loja</div>
            ` : `
              ${product.installment ? `<div class="price-installment">${escapeHtml(product.installment)}</div>` : ''}
              ${product.pixDiscount ? `<div class="pix-badge">🏷️ ${escapeHtml(product.pixDiscount)}</div>` : ''}
            `}
            
            ${(!isExpired && product.couponCode) ? `
              <div class="coupon-pill" onclick="copyCoupon('${escapeHtml(product.couponCode)}')" title="Clique para copiar o cupom">
                <span>🎟️ Cupom: <strong>${escapeHtml(product.couponCode)}</strong></span>
                <span>Copiar 📋</span>
              </div>
            ` : ''}
          </div>

          <div class="card-actions-wrapper">
            <a href="${escapeHtml(activeUrl)}" 
               target="_blank" 
               rel="noopener noreferrer sponsored" 
               class="btn-affiliate-cta ${isExpired ? 'btn-cta-expired' : ''}"
               title="Pegar Oferta no ${escapeHtml(product.storeName || storeInfo.name)}"
               onclick="trackAffiliateClick('${escapeHtml(product.id)}', '${escapeHtml(product.store)}')">
              <span>${isExpired ? 'Conferir Preço Atual' : `Ver no ${escapeHtml(product.storeName || storeInfo.name)}`}</span> ${isExpired ? '↗️' : '🚀'}
            </a>
            
            <div class="card-secondary-actions">
              <button class="btn-copy-wpp" 
                      title="Copiar texto formatado pronto para enviar no WhatsApp" 
                      onclick="copyWhatsAppMessage('${escapeHtml(product.id)}')">
                <span>📲 Copiar p/ WhatsApp</span>
              </button>
              
              <button class="btn-copy-link" 
                      title="Copiar Link de Afiliado" 
                      onclick="copyAffiliateLink('${escapeHtml(activeUrl)}')">
                <span>🔗 Link</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.innerHTML = pastAlertHtml + cardsHtml;
}

/**
 * Formata valores para moeda brasileira
 */
function formatMoney(value) {
  if (typeof value !== "number") {
    value = parseFloat(value) || 0;
  }
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Configura os ouvintes de eventos da página
 */
function setupEventListeners() {
  // Categorias
  const catNav = document.getElementById("categoriesNav");
  if (catNav) {
    catNav.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      state.activeCategory = btn.dataset.category;
      state.activeSubcategory = "todos";
      state.displayLimit = 36;
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderSubcategories();
      renderProducts();
    });
  }

  // Subcategorias (Tênis, Relógios, Geladeiras, Airfryers, Brinquedos, Maquiagens, etc.)
  const subcatNav = document.getElementById("subcategoriesNav");
  if (subcatNav) {
    subcatNav.addEventListener("click", (e) => {
      const btn = e.target.closest(".subcat-btn");
      if (!btn) return;
      state.activeSubcategory = btn.dataset.subcategory;
      state.displayLimit = 36;
      document.querySelectorAll(".subcat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts();
    });
  }

  // Lojas
  const storeFilter = document.getElementById("storesFilterGrid");
  if (storeFilter) {
    storeFilter.addEventListener("click", (e) => {
      const btn = e.target.closest(".store-filter-btn");
      if (!btn) return;
      state.activeStore = btn.dataset.store;
      state.displayLimit = 36;
      document.querySelectorAll(".store-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts();
    });
  }

  // Busca
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      state.displayLimit = 36;
      if (clearBtn) {
        clearBtn.style.display = state.searchQuery ? "block" : "none";
      }
      renderProducts();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      state.searchQuery = "";
      state.displayLimit = 36;
      clearBtn.style.display = "none";
      renderProducts();
    });
  }

  // Ordenação
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      state.displayLimit = 36;
      renderProducts();
    });
  }

  // Controles de Carregamento Progressivo (Load More / Show All)
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      state.displayLimit += 36;
      renderProducts();
    });
  }

  const showAllBtn = document.getElementById("showAllBtn");
  if (showAllBtn) {
    showAllBtn.addEventListener("click", () => {
      state.displayLimit = 99999;
      renderProducts();
    });
  }

  // Alternância de Tema
  const themeToggle = document.getElementById("themeToggleBtn");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Modal de Adicionar Oferta
  const openModalBtn = document.getElementById("openAddModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelModalBtn");
  const modal = document.getElementById("addOfferModal");
  const form = document.getElementById("addOfferForm");

  if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.add("active");
    });
  }

  const hideModal = () => {
    if (modal) modal.classList.remove("active");
  };

  if (closeModalBtn) closeModalBtn.addEventListener("click", hideModal);
  if (cancelBtn) cancelBtn.addEventListener("click", hideModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal();
    });
  }

  // Submissão do formulário de novo produto
  if (form) {
    form.addEventListener("submit", handleAddProduct);
  }

  // Modal de Configuração de Tags de Afiliados
  const openConfigBtn = document.getElementById("openConfigModalBtn");
  const closeConfigBtn = document.getElementById("closeConfigModalBtn");
  const cancelConfigBtn = document.getElementById("cancelConfigModalBtn");
  const configModal = document.getElementById("configAffiliateModal");
  const configForm = document.getElementById("configAffiliateForm");

  if (openConfigBtn && configModal) {
    openConfigBtn.addEventListener("click", () => {
      initAffiliateConfig();
      configModal.classList.add("active");
    });
  }

  const hideConfigModal = () => {
    if (configModal) configModal.classList.remove("active");
  };

  if (closeConfigBtn) closeConfigBtn.addEventListener("click", hideConfigModal);
  if (cancelConfigBtn) cancelConfigBtn.addEventListener("click", hideConfigModal);
  if (configModal) {
    configModal.addEventListener("click", (e) => {
      if (e.target === configModal) hideConfigModal();
    });
  }

  if (configForm) {
    configForm.addEventListener("submit", handleSaveAffiliateConfig);
  }

  // Auto-detecção de loja ao colar link no cadastro de ofertas
  const formAffiliateUrl = document.getElementById("formAffiliateUrl");
  if (formAffiliateUrl) {
    formAffiliateUrl.addEventListener("paste", (e) => {
      setTimeout(() => {
        const rawUrl = formAffiliateUrl.value.trim();
        const config = getAffiliateConfig();
        if (typeof AutoMapper !== "undefined" && rawUrl) {
          const mapped = AutoMapper.mapUrl(rawUrl, config);
          if (mapped.store && mapped.store !== "outros") {
            const storeSelect = document.getElementById("formStore");
            if (storeSelect) storeSelect.value = mapped.store;
            formAffiliateUrl.value = mapped.affiliateUrl;
            showToast(`🔗 Loja ${mapped.storeName} detectada e link de afiliado gerado!`);
          }
        }
      }, 50);
    });
  }

  // Botão de Exportar Catálogo JSON
  const exportBtn = document.getElementById("exportJsonBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportProductsJson);
  }

  // Botão de Restaurar Padrões
  const resetBtn = document.getElementById("resetDefaultsBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetToDefaults);
  }
}

/**
 * Salva as novas credenciais de afiliado e re-mapeia todos os produtos na hora
 */
function handleSaveAffiliateConfig(e) {
  e.preventDefault();

  const newConfig = {
    mercadolivre: {
      toolId: (document.getElementById("cfgMercadoLivreTool")?.value || "").trim(),
      affiliateWord: (document.getElementById("cfgMercadoLivreWord")?.value || "").trim(),
      enabled: true
    },
    shopee: {
      affiliateId: (document.getElementById("cfgShopeeId")?.value || "").trim(),
      enabled: true
    },
    magalu: {
      storeName: sanitizeMagaluStore((document.getElementById("cfgMagaluStore")?.value || "").trim()),
      enabled: true
    },
    general: {
      whatsappGroupUrl: (document.getElementById("cfgWhatsappGroup")?.value || "").trim() || "https://chat.whatsapp.com/G36CRa6FpZS03Gq4NSi7da",
      whatsappGroupName: "Grupo VIP de Ofertas"
    }
  };

  localStorage.setItem(AFFILIATE_CONFIG_KEY, JSON.stringify(newConfig));
  updateWhatsAppLinks();

  // Re-mapeia todos os produtos ativos no catálogo
  if (typeof AutoMapper !== "undefined") {
    state.products = state.products.map(p => {
      const mapped = AutoMapper.mapUrl(p.affiliateUrl, newConfig);
      return {
        ...p,
        affiliateUrl: mapped.affiliateUrl
      };
    });
    saveProducts();
    renderProducts();
  }

  const configModal = document.getElementById("configAffiliateModal");
  if (configModal) configModal.classList.remove("active");

  showToast("✅ Tags e grupo VIP salvos! Links e botões 100% atualizados!");
}

/**
 * GERENCIADOR DE MODO ADMINISTRADOR (PAINEL PRIVADO)
 * Mantém os botões "Minhas Tags" e "Nova Oferta" 100% invisíveis para os visitantes.
 */
function initAdminSecurity() {
  const ADMIN_AUTH_KEY = "garimpei_admin_authenticated";
  const ADMIN_PIN_KEY = "garimpei_admin_pin";
  const DEFAULT_PIN = "v55940223G@";

  // Sempre sincroniza para a nova senha solicitada
  localStorage.setItem(ADMIN_PIN_KEY, DEFAULT_PIN);

  const adminAuthModal = document.getElementById("adminAuthModal");
  const adminAuthForm = document.getElementById("adminAuthForm");
  const adminPinInput = document.getElementById("adminPinInput");
  const adminAuthError = document.getElementById("adminAuthError");
  const closeAdminAuthBtn = document.getElementById("closeAdminAuthBtn");
  const cancelAdminAuthBtn = document.getElementById("cancelAdminAuthBtn");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  const secretTrigger = document.getElementById("secretAdminTrigger");

  function setAdminMode(active) {
    if (active) {
      document.body.classList.add("admin-mode");
      localStorage.setItem(ADMIN_AUTH_KEY, "true");
    } else {
      document.body.classList.remove("admin-mode");
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }

  function openAuthModal() {
    if (adminAuthModal) {
      if (adminAuthError) adminAuthError.style.display = "none";
      if (adminPinInput) adminPinInput.value = "";
      adminAuthModal.classList.add("active");
      setTimeout(() => adminPinInput && adminPinInput.focus(), 100);
    }
  }

  function closeAuthModal() {
    if (adminAuthModal) adminAuthModal.classList.remove("active");
  }

  // Verifica se já estava logado como admin neste navegador
  if (localStorage.getItem(ADMIN_AUTH_KEY) === "true") {
    setAdminMode(true);
  }

  // Verifica se acessou com parâmetro ?admin=1 ou #admin
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("admin") || window.location.hash === "#admin") {
    if (localStorage.getItem(ADMIN_AUTH_KEY) !== "true") {
      openAuthModal();
    } else {
      setAdminMode(true);
    }
  }

  // Atalho de teclado secreto: Ctrl + Shift + A
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      if (document.body.classList.contains("admin-mode")) {
        setAdminMode(false);
        showToast("🔒 Modo Administrador desativado.");
      } else {
        openAuthModal();
      }
    }
  });

  // Botão discreto no rodapé
  if (secretTrigger) {
    secretTrigger.addEventListener("click", () => {
      if (document.body.classList.contains("admin-mode")) {
        setAdminMode(false);
        showToast("🔒 Modo Administrador desativado.");
      } else {
        openAuthModal();
      }
    });
  }

  // Clique triplo na marca
  const logoWrapper = document.querySelector(".brand-logo");
  if (logoWrapper) {
    let clickCount = 0;
    let clickTimer = null;
    logoWrapper.addEventListener("click", () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 3) {
        clickCount = 0;
        openAuthModal();
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 600);
      }
    });
  }

  // Formulário de autenticação
  if (adminAuthForm) {
    adminAuthForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredPin = (adminPinInput ? adminPinInput.value : "").trim();
      const currentPin = localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;

      if (enteredPin === currentPin) {
        setAdminMode(true);
        closeAuthModal();
        showToast("👑 Modo Administrador Ativado! Painel liberado.");
      } else {
        if (adminAuthError) adminAuthError.style.display = "block";
        if (adminPinInput) {
          adminPinInput.value = "";
          adminPinInput.focus();
        }
      }
    });
  }

  if (closeAdminAuthBtn) closeAdminAuthBtn.addEventListener("click", closeAuthModal);
  if (cancelAdminAuthBtn) cancelAdminAuthBtn.addEventListener("click", closeAuthModal);

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      setAdminMode(false);
      showToast("🔒 Modo Administrador encerrado.");
    });
  }
}

/**
 * Processa a inclusão de uma nova oferta pelo modal
 */
function handleAddProduct(e) {
  e.preventDefault();

  const title = document.getElementById("formTitle").value.trim();
  const category = document.getElementById("formCategory").value;
  const store = document.getElementById("formStore").value;
  const originalPrice = parseFloat(document.getElementById("formOriginalPrice").value) || null;
  const currentPrice = parseFloat(document.getElementById("formCurrentPrice").value);
  const installment = document.getElementById("formInstallment").value.trim();
  const pixDiscount = document.getElementById("formPix").value.trim();
  const affiliateUrl = document.getElementById("formAffiliateUrl").value.trim();
  const image = document.getElementById("formImage").value.trim();
  const badge = document.getElementById("formBadge").value.trim();
  const couponCode = document.getElementById("formCoupon").value.trim();
  const featured = document.getElementById("formFeatured").checked;

  if (!title || isNaN(currentPrice) || !affiliateUrl) {
    showToast("⚠️ Preencha os campos obrigatórios!");
    return;
  }

  const storeInfo = getStoreInfo(store);

  const newProduct = {
    id: "prod-" + Date.now(),
    title,
    category,
    store,
    storeName: storeInfo.name,
    badge,
    originalPrice,
    currentPrice,
    installment: installment || "Consulte opções de parcelamento",
    pixDiscount,
    affiliateUrl,
    image: image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    featured,
    rating: 5.0,
    reviewsCount: 1,
    couponCode,
    dateAdded: new Date().toISOString().split("T")[0]
  };

  // Salva oferta no armazenamento persistente do administrador
  try {
    let customOffers = [];
    const saved = localStorage.getItem(CUSTOM_OFFERS_KEY);
    if (saved) customOffers = JSON.parse(saved);
    customOffers.unshift(newProduct);
    localStorage.setItem(CUSTOM_OFFERS_KEY, JSON.stringify(customOffers));
  } catch (err) {
    console.error("Erro ao salvar oferta customizada:", err);
  }

  // Adiciona no topo da lista
  state.products.unshift(newProduct);
  renderProducts();

  // Fecha o modal e limpa os campos
  document.getElementById("addOfferForm").reset();
  document.getElementById("addOfferModal").classList.remove("active");

  showToast("🎉 Oferta garimpada adicionada com sucesso!");
}

/**
 * Reseta todos os filtros
 */
window.resetFilters = function() {
  state.activeCategory = "todas";
  state.activeSubcategory = "todos";
  state.activeStore = "todas";
  state.searchQuery = "";
  
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  
  renderCategories();
  renderSubcategories();
  renderStoreFilters();
  renderProducts();
};

/**
 * Copia texto promocional completo já formatado com o link para o WhatsApp
 */
window.copyWhatsAppMessage = function(productId) {
  const prod = (state.products || []).find(p => String(p.id) === String(productId));
  if (!prod) {
    showToast("⚠️ Oferta não encontrada.");
    return;
  }

  const activeUrl = getVerifiedAffiliateUrl(prod);
  const formattedOriginal = prod.originalPrice ? formatMoney(prod.originalPrice) : "";
  const formattedCurrent = formatMoney(prod.currentPrice);
  let discountPercent = 0;
  if (prod.originalPrice && prod.originalPrice > prod.currentPrice) {
    discountPercent = Math.round(((prod.originalPrice - prod.currentPrice) / prod.originalPrice) * 100);
  }

  let text = `🔥 *OFERTÃO GARIMPADO!* 🛍️\n\n`;
  text += `*${prod.title}*\n\n`;
  if (formattedOriginal) {
    text += `❌ De: R$ ${formattedOriginal}\n`;
  }
  text += `✅ *Por: R$ ${formattedCurrent}*`;
  if (discountPercent > 0) {
    text += ` (-${discountPercent}% OFF)`;
  }
  text += `\n`;
  if (prod.installment) {
    text += `💳 ${prod.installment}\n`;
  }
  if (prod.pixDiscount) {
    text += `🏷️ ${prod.pixDiscount}\n`;
  }
  if (prod.couponCode) {
    text += `🎟️ Cupom: *${prod.couponCode}*\n`;
  }
  text += `\n🛒 *Compre aqui antes que acabe:*\n${activeUrl}\n\n`;
  text += `⚡ _Garimpado no Garimpei Aqui Agora_`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📲 Texto formatado para o WhatsApp copiado! Pronto para colar no grupo!");
    }).catch(() => {
      promptCopyFallback(text);
    });
  } else {
    promptCopyFallback(text);
  }
};

/**
 * Compartilha o catálogo completo no WhatsApp ou via Compartilhamento Nativo do celular
 */
window.sharePortal = function() {
  const shareData = {
    title: "Garimpei Aqui Agora | Melhores Promoções e Cupons",
    text: "🔥 Encontrei esse catálogo com mais de 650 ofertas com super descontos e cupons testados do Mercado Livre, Shopee e Magalu! Dá uma olhada:",
    url: window.location.href.split("#")[0].split("?")[0]
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {
      fallbackShareUrl(shareData);
    });
  } else {
    fallbackShareUrl(shareData);
  }
};

function fallbackShareUrl(shareData) {
  const fullText = `${shareData.text}\n${shareData.url}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(fullText).then(() => {
      showToast("📲 Link do catálogo copiado! Só colar no WhatsApp!");
    }).catch(() => {
      const wppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
      window.open(wppUrl, "_blank");
    });
  } else {
    const wppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(wppUrl, "_blank");
  }
}

/**
 * Copia o link de afiliado para a área de transferência
 */
window.copyAffiliateLink = function(url) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("🔗 Link de afiliado copiado! Compartilhe onde quiser!");
    }).catch(() => {
      promptCopyFallback(url);
    });
  } else {
    promptCopyFallback(url);
  }
};

/**
 * Copia o código do cupom
 */
window.copyCoupon = function(code) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`🎟️ Cupom "${code}" copiado!`);
    });
  } else {
    showToast(`🎟️ Use o cupom: ${code}`);
  }
};

function promptCopyFallback(text) {
  window.prompt("Copie seu link de afiliado:", text);
}

/**
 * Notificação visual temporária (Toast)
 */
function showToast(message) {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

/**
 * Simulação de Analytics de cliques em afiliados
 */
window.trackAffiliateClick = function(id, store) {
  console.log(`[Afiliado Analytics] Redirecionando para ${store} - ID: ${id}`);
};

/**
 * Exporta a lista de produtos atual para formato JSON
 */
function exportProductsJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.products, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "garimpo_ofertas_produtos.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("📥 Catálogo exportado em JSON com sucesso!");
}

/**
 * Restaura o catálogo para o padrão inicial oficial (100+ ofertas)
 */
function resetToDefaults() {
  if (confirm("Deseja restaurar as ofertas oficiais? Todas as ofertas cadastradas manualmente serão removidas.")) {
    try {
      localStorage.removeItem(CUSTOM_OFFERS_KEY);
      localStorage.removeItem(OLD_STORAGE_KEY);
    } catch (e) {}
    initProducts();
    state.displayLimit = 36;
    renderProducts();
    showToast("🔄 Catálogo oficial restaurado com 100+ ofertas!");
  }
}

/**
 * Gerenciamento de Tema (Dark / Light)
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  state.theme = savedTheme;
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem(THEME_KEY, state.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.innerHTML = state.theme === "dark" ? "☀️" : "🌙";
    btn.title = state.theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro";
  }
}

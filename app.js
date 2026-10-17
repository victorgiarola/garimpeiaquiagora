/**
 * GARIMPO DE OFERTAS - APLICAÇÃO PRINCIPAL
 * Gerenciamento dinâmico de produtos, filtros, busca, cópia de links de afiliado e painel de cadastro
 */

// Estado global da aplicação
const state = {
  products: [],
  activeCategory: "todas",
  activeStore: "todas",
  searchQuery: "",
  sortBy: "recentes",
  theme: "dark",
  displayLimit: 36 // Exibe inicialmente 36 ofertas com carregamento progressivo
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
  renderStoreFilters();
  setupEventListeners();
  renderProducts();
});

/**
 * Retorna as credenciais ativas de afiliados (LocalStorage ou Padrão)
 */
function getAffiliateConfig() {
  try {
    const saved = localStorage.getItem(AFFILIATE_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Erro ao ler config de afiliados:", err);
  }
  return typeof AFFILIATE_CONFIG !== "undefined" ? AFFILIATE_CONFIG : {
    mercadolivre: { toolId: "", affiliateWord: "" },
    shopee: { affiliateId: "" },
    magalu: { storeName: "magazinemaisofertas" }
  };
}

/**
 * Inicializa e preenche o modal de configuração de afiliados (Lojas ativas: Mercado Livre, Shopee, Magalu)
 */
function initAffiliateConfig() {
  const config = getAffiliateConfig();
  const shopeeInput = document.getElementById("cfgShopeeId");
  const magaluInput = document.getElementById("cfgMagaluStore");
  const mlToolInput = document.getElementById("cfgMercadoLivreTool");
  const mlWordInput = document.getElementById("cfgMercadoLivreWord");

  if (shopeeInput && config.shopee) shopeeInput.value = config.shopee.affiliateId || "";
  if (magaluInput && config.magalu) magaluInput.value = config.magalu.storeName || "";
  if (mlToolInput && config.mercadolivre) mlToolInput.value = config.mercadolivre.toolId || "";
  if (mlWordInput && config.mercadolivre) mlWordInput.value = config.mercadolivre.affiliateWord || "";
}

/**
 * Inicializa os produtos carregando o catálogo oficial massivo (100+ ofertas)
 * e mescla com quaisquer ofertas customizadas criadas pelo administrador.
 * Remove caches defasados para garantir que todos os visitantes vejam o catálogo completo.
 */
function initProducts() {
  // Limpa cache antigo que limitava a 12 ofertas
  try {
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch (e) {}

  const config = getAffiliateConfig();

  // 1. Carrega todas as ofertas oficiais de Mercado Livre, Shopee e Magalu
  const baseProducts = (typeof DEFAULT_PRODUCTS !== "undefined" && Array.isArray(DEFAULT_PRODUCTS))
    ? [...DEFAULT_PRODUCTS]
    : [];

  // 2. Carrega ofertas manuais cadastradas pelo administrador
  let customOffers = [];
  try {
    const savedCustom = localStorage.getItem(CUSTOM_OFFERS_KEY);
    if (savedCustom) {
      customOffers = JSON.parse(savedCustom);
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
  if (typeof AutoMapper !== "undefined") {
    state.products = combined.map(p => {
      const mapped = AutoMapper.mapUrl(p.affiliateUrl, config);
      return {
        ...p,
        affiliateUrl: mapped.affiliateUrl
      };
    });
  } else {
    state.products = combined;
  }
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

  container.innerHTML = CATEGORIES.map(cat => `
    <button class="cat-btn ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.icon}</span>
      <span>${cat.name}</span>
    </button>
  `).join("");
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
    const store = STORES[key] || { name: key, logoEmoji: "🛒" };
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
  if (state.activeCategory === "destaques") {
    list = list.filter(p => p.featured);
  } else if (state.activeCategory !== "todas") {
    list = list.filter(p => p.category === state.activeCategory);
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
    if (visibleItems.length < items.length) {
      stats.innerHTML = `Exibindo <strong>${visibleItems.length}</strong> de <strong>${items.length}</strong> super ofertas garimpadas`;
    } else {
      stats.innerHTML = `Exibindo <strong>${items.length}</strong> ${items.length === 1 ? 'oferta garimpada' : 'ofertas garimpadas'} com super descontos`;
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

  grid.innerHTML = visibleItems.map(product => {
    const storeInfo = STORES[product.store] || STORES.outros;
    
    // Cálculo do Desconto %
    let discountPercent = 0;
    if (product.originalPrice && product.originalPrice > product.currentPrice) {
      discountPercent = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
    }

    const formattedOriginal = product.originalPrice ? formatMoney(product.originalPrice) : "";
    const formattedCurrent = formatMoney(product.currentPrice);

    return `
      <article class="product-card" id="card-${product.id}">
        <div class="card-image-wrap">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" class="card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'" />
          
          ${discountPercent > 0 ? `
            <div class="badge-discount">-${discountPercent}% OFF</div>
          ` : ''}

          ${product.badge ? `
            <div class="badge-featured">✨ ${escapeHtml(product.badge)}</div>
          ` : ''}

          <div class="store-ribbon" style="background: ${storeInfo.color}; color: ${storeInfo.textColor};">
            <span>${storeInfo.logoEmoji}</span> ${escapeHtml(product.storeName || storeInfo.name)}
          </div>
        </div>

        <div class="card-body">
          <h2 class="card-title" title="${escapeHtml(product.title)}">
            ${escapeHtml(product.title)}
          </h2>

          <div class="card-rating">
            <span>⭐ ${product.rating || "4.8"}</span>
            <span class="reviews-count">(${product.reviewsCount ? product.reviewsCount.toLocaleString('pt-BR') : '1.200+'})</span>
          </div>

          <div class="price-container">
            ${formattedOriginal ? `<div class="price-original">De ${formattedOriginal}</div>` : ''}
            <div class="price-row">
              <span class="price-current">R$ ${formattedCurrent}</span>
            </div>
            ${product.installment ? `<div class="price-installment">${escapeHtml(product.installment)}</div>` : ''}
            ${product.pixDiscount ? `<div class="pix-badge">🏷️ ${escapeHtml(product.pixDiscount)}</div>` : ''}
            
            ${product.couponCode ? `
              <div class="coupon-pill" onclick="copyCoupon('${escapeHtml(product.couponCode)}')" title="Clique para copiar o cupom">
                <span>🎟️ Cupom: <strong>${escapeHtml(product.couponCode)}</strong></span>
                <span>Copiar 📋</span>
              </div>
            ` : ''}
          </div>

          <div class="card-actions">
            <a href="${escapeHtml(product.affiliateUrl)}" 
               target="_blank" 
               rel="noopener noreferrer sponsored" 
               class="btn-affiliate-cta"
               onclick="trackAffiliateClick('${escapeHtml(product.id)}', '${escapeHtml(product.store)}')">
              <span>Pegar Oferta</span> 🚀
            </a>
            
            <button class="btn-copy-link" 
                    title="Copiar Link de Afiliado" 
                    onclick="copyAffiliateLink('${escapeHtml(product.affiliateUrl)}')">
              🔗
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
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
      state.displayLimit = 36;
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
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
      storeName: (document.getElementById("cfgMagaluStore")?.value || "").trim() || "magazinemaisofertas",
      enabled: true
    }
  };

  localStorage.setItem(AFFILIATE_CONFIG_KEY, JSON.stringify(newConfig));

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

  showToast("✅ Tags salvas! Links do Mercado Livre agora com toolId e matt_word aplicados!");
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

  const storeInfo = STORES[store] || STORES.outros;

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
  state.activeStore = "todas";
  state.searchQuery = "";
  
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  
  renderCategories();
  renderStoreFilters();
  renderProducts();
};

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

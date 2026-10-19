/**
 * AUTO-MAPPER DE AFILIADOS
 * Transforma links comuns de qualquer loja em links oficiais de afiliado com as suas credenciais.
 * Funciona tanto no Navegador quanto no Node.js.
 */

const AutoMapper = {
  /**
   * Converte uma URL comum para seu link de afiliado correspondente
   * @param {string} rawUrl - A URL original do produto
   * @param {object} config - Objeto com as tags de afiliado (Amazon, Shopee, etc.)
   * @returns {object} { affiliateUrl, store, storeName }
   */
  mapUrl(rawUrl, config = {}) {
    if (!rawUrl || typeof rawUrl !== "string") {
      return { affiliateUrl: rawUrl, store: "outros", storeName: "Loja Parceira" };
    }

    let cleanUrl = rawUrl.trim();

    // Remove qualquer duplicação acidental na URL (ex: https://dominio/https://...)
    while (/^https?:\/\/[^/]+\/https?:\/\//i.test(cleanUrl)) {
      cleanUrl = cleanUrl.replace(/^https?:\/\/[^/]+\//i, "");
    }

    // 1. AMAZON BRASIL
    if (cleanUrl.includes("amazon.com.br") || cleanUrl.includes("amzn.to")) {
      const tag = config.amazon?.tag || "garimpo-20";
      return {
        affiliateUrl: this.formatAmazon(cleanUrl, tag),
        store: "amazon",
        storeName: "Amazon"
      };
    }

    // 2. MERCADO LIVRE
    if (cleanUrl.includes("mercadolivre.com") || cleanUrl.includes("mercadolivre.com.br") || cleanUrl.includes("meli.la")) {
      const toolId = config.mercadolivre?.toolId || "";
      const affiliateWord = config.mercadolivre?.affiliateWord || config.mercadolivre?.word || "";
      return {
        affiliateUrl: this.formatMercadoLivre(cleanUrl, toolId, affiliateWord),
        store: "mercadolivre",
        storeName: "Mercado Livre"
      };
    }

    // 3. SHOPEE BRASIL
    if (cleanUrl.includes("shopee.com.br") || cleanUrl.includes("shope.ee")) {
      const affId = config.shopee?.affiliateId || "";
      return {
        affiliateUrl: this.formatShopee(cleanUrl, affId),
        store: "shopee",
        storeName: "Shopee"
      };
    }

    // 4. MAGAZINE LUIZA (MAGALU / MAGAZINE VOCÊ)
    if (cleanUrl.includes("magazineluiza.com.br") || cleanUrl.includes("magazinevoce.com.br")) {
      const storeName = config.magalu?.storeName || "magazinemaisofertas";
      return {
        affiliateUrl: this.formatMagalu(cleanUrl, storeName),
        store: "magalu",
        storeName: "Magalu"
      };
    }

    // 5. ALIEXPRESS
    if (cleanUrl.includes("aliexpress.com") || cleanUrl.includes("s.click.aliexpress.com")) {
      const trackingId = config.aliexpress?.trackingId || "";
      return {
        affiliateUrl: this.formatAliExpress(cleanUrl, trackingId),
        store: "aliexpress",
        storeName: "AliExpress"
      };
    }

    return { affiliateUrl: cleanUrl, store: "outros", storeName: "Loja Parceira" };
  },

  /**
   * Converte URL da Amazon adicionando sua tag e limpando rastreios antigos
   */
  formatAmazon(url, tag) {
    try {
      // Extrai o ASIN (código único de 10 dígitos do produto na Amazon)
      const asinMatch = url.match(/(?:\/dp\/|\/gp\/product\/|\/ASIN\/)([A-Z0-9]{10})/i);
      if (asinMatch && asinMatch[1]) {
        const asin = asinMatch[1].toUpperCase();
        return `https://www.amazon.com.br/dp/${asin}?tag=${encodeURIComponent(tag)}`;
      }

      // Se for URL geral ou de busca
      const parsed = new URL(url);
      parsed.searchParams.delete("tag");
      parsed.searchParams.set("tag", tag);
      return parsed.toString();
    } catch {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}tag=${encodeURIComponent(tag)}`;
    }
  },

  /**
   * Converte URL do Mercado Livre
   * Aplica as DUAS métricas obrigatórias:
   * - matt_tool: ID da Ferramenta de Afiliado
   * - matt_word: Palavra-chave / Canal de Rastreio
   */
  formatMercadoLivre(url, toolId, affiliateWord) {
    try {
      // Se já for link encurtado oficial do programa de afiliados (meli.la ou /sec/), mantém as credenciais
      if (url.includes("meli.la") || url.includes("/sec/")) {
        return url;
      }
      const parsed = new URL(url);
      if (toolId) {
        parsed.searchParams.set("matt_tool", toolId);
      }
      if (affiliateWord) {
        parsed.searchParams.set("matt_word", affiliateWord);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  },

  /**
   * Converte URL da Shopee
   * - Preserva links encurtados oficiais (s.shopee.com.br / shope.ee)
   * - Detecta URLs inválidas do tipo /product/<texto-slug> e IDs fictícios que causam erro 404 na Shopee
   * - Converte automaticamente em /search?keyword=<termo> com os parâmetros de afiliado oficiais
   */
  formatShopee(url, affId) {
    try {
      // Se for link já encurtado oficial da Shopee Afiliados (s.shopee.com.br ou shope.ee), mantém intacto
      if (url.includes("s.shopee.com.br") || url.includes("shope.ee")) {
        return url;
      }

      // Limpa qualquer duplicação acidental na URL
      let cleanUrl = String(url || "").trim();
      while (/^https?:\/\/[^/]+\/https?:\/\//i.test(cleanUrl)) {
        cleanUrl = cleanUrl.replace(/^https?:\/\/[^/]+\//i, "");
      }

      const cleanAff = affId ? String(affId).trim().replace(/^an_/, "") : "18345170182";

      // Verifica se é uma URL do tipo /product/<slug-de-texto> ou com ID de loja fictício (/product/58123910/...)
      // A Shopee dá 404 nesses caminhos! O formato universal funcional é /search?keyword=...
      const isProductSlug = cleanUrl.includes("/product/") && !cleanUrl.match(/\/product\/\d{5,}\/\d{5,}/);
      const isDummyShop = cleanUrl.includes("/product/58123910/");

      if (isProductSlug || isDummyShop) {
        let keyword = "";
        const slugMatch = cleanUrl.match(/\/product\/([a-zA-Z0-9_-]+)/i);
        if (slugMatch && slugMatch[1] && isNaN(Number(slugMatch[1]))) {
          keyword = slugMatch[1].replace(/[-_+]/g, " ").trim();
        }
        if (!keyword) {
          try {
            const tempUrl = new URL(cleanUrl);
            keyword = tempUrl.searchParams.get("keyword") || "";
          } catch {}
        }
        if (!keyword) keyword = "ofertas";

        const searchUrl = `https://shopee.com.br/search?keyword=${encodeURIComponent(keyword)}`;
        const parsed = new URL(searchUrl);
        if (cleanAff) {
          parsed.searchParams.set("utm_source", "an_" + cleanAff);
          parsed.searchParams.set("utm_medium", "affiliates");
          parsed.searchParams.set("af_siteid", cleanAff);
        }
        return parsed.toString();
      }

      const parsed = new URL(cleanUrl);
      if (cleanAff) {
        parsed.searchParams.set("utm_source", "an_" + cleanAff);
        parsed.searchParams.set("utm_medium", "affiliates");
        parsed.searchParams.set("af_siteid", cleanAff);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  },

  /**
   * Sanitiza o identificador da loja Magalu (Magazine Você), extraindo apenas o slug
   */
  sanitizeMagaluStore(storeName) {
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
  },

  /**
   * Converte link comum do Magalu para o Magazine Você da sua loja
   */
  formatMagalu(url, storeName) {
    try {
      const cleanStore = this.sanitizeMagaluStore(storeName);

      // Limpa qualquer duplicação acidental na URL recebida
      let cleanUrl = String(url || "").trim();
      while (/^https?:\/\/[^/]+\/https?:\/\//i.test(cleanUrl)) {
        cleanUrl = cleanUrl.replace(/^https?:\/\/[^/]+\//i, "");
      }

      // Pega o código do produto no final da URL
      // Ex: magazineluiza.com.br/p/234902100/ ou /p/237291500
      const match = cleanUrl.match(/\/p\/([a-zA-Z0-9]+)/i);
      if (match && match[1]) {
        return `https://www.magazinevoce.com.br/${cleanStore}/p/${match[1]}/`;
      }
      return `https://www.magazinevoce.com.br/${cleanStore}/`;
    } catch {
      return url;
    }
  },

  /**
   * Converte link do AliExpress
   */
  formatAliExpress(url, trackingId) {
    try {
      const parsed = new URL(url);
      if (trackingId) {
        parsed.searchParams.set("aff_fcid", trackingId);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }
};

// Exportação para Node e Browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = AutoMapper;
} else if (typeof window !== "undefined") {
  window.AutoMapper = AutoMapper;
}

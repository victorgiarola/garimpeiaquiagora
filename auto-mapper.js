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

    const cleanUrl = rawUrl.trim();

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
      return {
        affiliateUrl: this.formatMercadoLivre(cleanUrl, toolId),
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
   */
  formatMercadoLivre(url, toolId) {
    try {
      const parsed = new URL(url);
      if (toolId) {
        parsed.searchParams.set("matt_tool", toolId);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  },

  /**
   * Converte URL da Shopee
   */
  formatShopee(url, affId) {
    try {
      const parsed = new URL(url);
      if (affId) {
        parsed.searchParams.set("utm_source", "affiliate");
        parsed.searchParams.set("af_siteid", affId);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  },

  /**
   * Converte link comum do Magalu para o Magazine Você da sua loja
   */
  formatMagalu(url, storeName) {
    try {
      // Pega o código do produto no final da URL
      // Ex: magazineluiza.com.br/p/234902100/
      const match = url.match(/\/p\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        return `https://www.magazinevoce.com.br/${storeName}/p/${match[1]}/`;
      }
      return `https://www.magazinevoce.com.br/${storeName}/`;
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

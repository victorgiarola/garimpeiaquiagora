// Configurações de Afiliado para o Garimpo de Ofertas
// Insira aqui os seus códigos e tags de afiliado de cada plataforma.
// O robô de automação usará essas tags para montar todos os links automaticamente!

const AFFILIATE_CONFIG = {
  amazon: {
    // Sua Tag de Associado da Amazon (ex: "garimpodeofertas-20" ou "joaofelipe-20")
    tag: "garimpo-20",
    enabled: true
  },
  mercadolivre: {
    // Seu ID de rastreio ou código de afiliado do Mercado Livre
    toolId: "garimpo_ml",
    enabled: true
  },
  shopee: {
    // Seu Universal Link ou ID de Afiliado Shopee
    affiliateId: "garimpo_shopee",
    enabled: true
  },
  magalu: {
    // Nome da sua loja no Magazine Você (ex: "magazinegarimpo")
    storeName: "magazinemaisofertas",
    enabled: true
  },
  aliexpress: {
    // Seu Tracking ID do AliExpress Portals
    trackingId: "garimpo_ali",
    enabled: true
  }
};

// Exporta para uso em Node e no Navegador
if (typeof module !== "undefined" && module.exports) {
  module.exports = AFFILIATE_CONFIG;
}

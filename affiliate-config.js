// Configurações Oficiais de Afiliado - Garimpei Aqui Agora
// Lojas ativas no momento: Mercado Livre, Shopee e Magazine Luiza

const AFFILIATE_CONFIG = {
  mercadolivre: {
    // 1. toolId (matt_tool): Código numérico da ferramenta no portal do Mercado Livre Afiliados
    // 2. affiliateWord (matt_word): Sua palavra-chave ou sub-id de rastreamento de canal
    toolId: "23610538", // Sua métrica do Mercado Livre (Projeto 2)
    affiliateWord: "givi713407", // Sua tag do Mercado Livre (Projeto 2)
    enabled: true
  },
  shopee: {
    // ID da sua conta de afiliado Shopee
    affiliateId: "18345170182",
    enabled: true
  },
  magalu: {
    // Nome da sua loja no Magazine Você
    // Converte os produtos automaticamente para: magazinevoce.com.br/magazinelugarcerto01/p/...
    storeName: "magazinelugarcerto01",
    enabled: true
  },
  // Pausados temporariamente até aprovação de afiliado:
  amazon: {
    tag: "",
    enabled: false
  },
  aliexpress: {
    trackingId: "",
    enabled: false
  }
};

// Exporta para uso em Node.js e no Navegador
if (typeof module !== "undefined" && module.exports) {
  module.exports = AFFILIATE_CONFIG;
}
